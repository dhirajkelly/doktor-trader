<?php
/**
 * Plugin Name: SLF Auto Articles
 * Description: Mengimpor artikel SEO harian Sarana Law Firm dari GitHub dan menjadwalkannya tayang otomatis (07.00, 12.00, 17.00 WIB). Menu: Tools → SLF Auto Articles.
 * Version: 1.0.0
 * Author: Sarana Law Firm
 * Requires at least: 5.8
 * Requires PHP: 7.4
 */

if (!defined('ABSPATH')) {
    exit;
}

define('SLF_AA_VERSION', '1.0.0');
define('SLF_AA_SOURCE', 'https://raw.githubusercontent.com/dhirajkelly/doktor-trader/main/content/sarana-law/');

/* ---------- Schedule ---------- */

register_activation_hook(__FILE__, function () {
    if (!wp_next_scheduled('slf_aa_sync')) {
        wp_schedule_event(time() + 60, 'hourly', 'slf_aa_sync');
    }
});

register_deactivation_hook(__FILE__, function () {
    wp_clear_scheduled_hook('slf_aa_sync');
});

add_action('slf_aa_sync', 'slf_aa_sync');

// Fallback for low-traffic sites where WP-Cron runs late: on any request, at most
// every 10 minutes, publish overdue posts and queue a sync if the last one is >1h old.
add_action('init', function () {
    if (get_transient('slf_aa_tick')) {
        return;
    }
    set_transient('slf_aa_tick', 1, 10 * MINUTE_IN_SECONDS);
    slf_aa_publish_due();
    $last = (int) get_option('slf_aa_last_sync', 0);
    if (time() - $last > HOUR_IN_SECONDS && !wp_next_scheduled('slf_aa_sync_once')) {
        wp_schedule_single_event(time(), 'slf_aa_sync_once');
    }
});
add_action('slf_aa_sync_once', 'slf_aa_sync');

/* ---------- Helpers ---------- */

function slf_aa_log($msg)
{
    $log = get_option('slf_aa_log', array());
    array_unshift($log, wp_date('Y-m-d H:i') . ' — ' . $msg);
    update_option('slf_aa_log', array_slice($log, 0, 60), false);
}

function slf_aa_get($path)
{
    $url = SLF_AA_SOURCE . ltrim($path, '/');
    $res = wp_remote_get(add_query_arg('t', time(), $url), array('timeout' => 25));
    if (is_wp_error($res)) {
        return $res;
    }
    $code = wp_remote_retrieve_response_code($res);
    if ($code !== 200) {
        return new WP_Error('slf_aa_http', "HTTP $code untuk $path");
    }
    return wp_remote_retrieve_body($res);
}

function slf_aa_author()
{
    $id = (int) get_option('slf_aa_author', 0);
    if ($id && get_userdata($id)) {
        return $id;
    }
    $u = get_users(array('search' => 'Sarana', 'search_columns' => array('display_name'), 'number' => 1, 'fields' => 'ID'));
    if ($u) {
        return (int) $u[0];
    }
    $a = get_users(array('role' => 'administrator', 'number' => 1, 'orderby' => 'ID', 'fields' => 'ID'));
    return $a ? (int) $a[0] : 1;
}

function slf_aa_find($id)
{
    $q = get_posts(array(
        'post_type' => 'post',
        'post_status' => array('publish', 'future', 'draft', 'pending', 'private', 'trash'),
        'meta_key' => '_slf_aa_id',
        'meta_value' => $id,
        'fields' => 'ids',
        'numberposts' => 1,
    ));
    return $q ? (int) $q[0] : 0;
}

function slf_aa_term_ids($names, $taxonomy)
{
    $ids = array();
    foreach ((array) $names as $name) {
        $name = sanitize_text_field($name);
        if ($name === '') {
            continue;
        }
        $t = term_exists($name, $taxonomy);
        if (!$t) {
            $t = wp_insert_term($name, $taxonomy);
        }
        if (!is_wp_error($t)) {
            $ids[] = (int) (is_array($t) ? $t['term_id'] : $t);
        }
    }
    return $ids;
}

function slf_aa_seo_plugin_active()
{
    return defined('WPSEO_VERSION') || class_exists('RankMath') || defined('AIOSEO_VERSION') || defined('SEOPRESS_VERSION');
}

/* ---------- Sync ---------- */

function slf_aa_sync()
{
    if (get_option('slf_aa_paused')) {
        return 0;
    }
    if (get_transient('slf_aa_lock')) {
        return 0;
    }
    set_transient('slf_aa_lock', 1, 5 * MINUTE_IN_SECONDS);
    update_option('slf_aa_last_sync', time(), false);

    $raw = slf_aa_get('index.json');
    if (is_wp_error($raw)) {
        slf_aa_log('Gagal ambil index: ' . $raw->get_error_message());
        delete_transient('slf_aa_lock');
        return 0;
    }
    $index = json_decode($raw, true);
    if (empty($index['items']) || !is_array($index['items'])) {
        slf_aa_log('Index kosong atau tidak valid.');
        delete_transient('slf_aa_lock');
        return 0;
    }

    $min_ts = (int) get_option('slf_aa_since', 0); // ignore items older than install
    $made = 0;
    foreach ($index['items'] as $it) {
        if ($made >= 6) {
            break; // keep each run short
        }
        $id = isset($it['id']) ? sanitize_title($it['id']) : '';
        $ts = isset($it['publish_at_utc']) ? strtotime($it['publish_at_utc']) : false;
        if (!$id || !$ts || $ts < $min_ts) {
            continue;
        }
        if (slf_aa_find($id) || get_page_by_path($id, OBJECT, 'post')) {
            continue;
        }
        $r = slf_aa_import($it, $ts);
        if (is_wp_error($r)) {
            slf_aa_log("Gagal impor $id: " . $r->get_error_message());
        } else {
            $made++;
            slf_aa_log("Diimpor: {$it['title']} (tayang " . get_date_from_gmt(gmdate('Y-m-d H:i:s', $ts), 'd M H:i') . ')');
        }
    }
    slf_aa_publish_due();
    delete_transient('slf_aa_lock');
    return $made;
}

function slf_aa_import($it, $ts)
{
    $html = slf_aa_get($it['html']);
    if (is_wp_error($html)) {
        return $html;
    }
    $now = time();
    $gmt = gmdate('Y-m-d H:i:s', $ts); // keep the planned date so permalinks match index.json
    $post_id = wp_insert_post(array(
        'post_type' => 'post',
        'post_title' => wp_strip_all_tags($it['title']),
        'post_name' => sanitize_title($it['slug']),
        'post_content' => wp_kses_post($html),
        'post_excerpt' => sanitize_text_field($it['excerpt'] ?? ''),
        'post_status' => $ts > $now ? 'future' : 'publish',
        'post_date_gmt' => $gmt,
        'post_date' => get_date_from_gmt($gmt),
        'post_author' => slf_aa_author(),
        'comment_status' => 'closed',
    ), true);
    if (is_wp_error($post_id)) {
        return $post_id;
    }

    update_post_meta($post_id, '_slf_aa_id', sanitize_title($it['id']));
    wp_set_post_categories($post_id, slf_aa_term_ids($it['categories'] ?? array(), 'category'));
    wp_set_post_tags($post_id, array_map('sanitize_text_field', (array) ($it['tags'] ?? array())));

    $title = sanitize_text_field($it['meta_title'] ?? '');
    $desc = sanitize_text_field($it['meta_description'] ?? '');
    $kw = sanitize_text_field($it['focus_keyword'] ?? '');
    $meta = array(
        '_slf_aa_desc' => $desc,
        '_yoast_wpseo_title' => $title, '_yoast_wpseo_metadesc' => $desc, '_yoast_wpseo_focuskw' => $kw,
        'rank_math_title' => $title, 'rank_math_description' => $desc, 'rank_math_focus_keyword' => $kw,
        '_aioseo_title' => $title, '_aioseo_description' => $desc,
    );
    foreach ($meta as $k => $v) {
        if ($v !== '') {
            update_post_meta($post_id, $k, $v);
        }
    }
    if (!empty($it['faq']) && is_array($it['faq'])) {
        $faq = array();
        foreach ($it['faq'] as $f) {
            if (!empty($f['q']) && !empty($f['a'])) {
                $faq[] = array('q' => sanitize_text_field($f['q']), 'a' => sanitize_text_field($f['a']));
            }
        }
        update_post_meta($post_id, '_slf_aa_faq', wp_json_encode($faq, JSON_UNESCAPED_UNICODE));
    }

    if (!empty($it['image'])) {
        require_once ABSPATH . 'wp-admin/includes/media.php';
        require_once ABSPATH . 'wp-admin/includes/file.php';
        require_once ABSPATH . 'wp-admin/includes/image.php';
        $alt = sanitize_text_field($it['image_alt'] ?? $it['title']);
        $att = media_sideload_image(SLF_AA_SOURCE . ltrim($it['image'], '/'), $post_id, $alt, 'id');
        if (!is_wp_error($att)) {
            set_post_thumbnail($post_id, $att);
            update_post_meta($att, '_wp_attachment_image_alt', $alt);
        } else {
            slf_aa_log('Gambar gagal: ' . $att->get_error_message());
        }
    }
    return $post_id;
}

// Publish scheduled auto-articles whose time has passed (fixes "Missed schedule").
function slf_aa_publish_due()
{
    $due = get_posts(array(
        'post_type' => 'post',
        'post_status' => 'future',
        'meta_key' => '_slf_aa_id',
        'date_query' => array(array('column' => 'post_date_gmt', 'before' => gmdate('Y-m-d H:i:s'))),
        'fields' => 'ids',
        'numberposts' => 10,
    ));
    foreach ($due as $pid) {
        wp_publish_post($pid);
    }
}

/* ---------- Front-end: FAQ schema + fallback meta ---------- */

add_action('wp_head', function () {
    if (!is_singular('post')) {
        return;
    }
    $pid = get_queried_object_id();
    if (!get_post_meta($pid, '_slf_aa_id', true)) {
        return;
    }
    if (!slf_aa_seo_plugin_active()) {
        $desc = get_post_meta($pid, '_slf_aa_desc', true);
        if ($desc) {
            echo '<meta name="description" content="' . esc_attr($desc) . '">' . "\n";
        }
        $img = get_the_post_thumbnail_url($pid, 'full');
        $article = array(
            '@context' => 'https://schema.org', '@type' => 'Article',
            'headline' => get_the_title($pid),
            'datePublished' => get_post_time('c', true, $pid),
            'dateModified' => get_post_modified_time('c', true, $pid),
            'mainEntityOfPage' => get_permalink($pid),
            'author' => array('@type' => 'Organization', 'name' => 'Sarana Law Firm', 'url' => home_url('/')),
            'publisher' => array('@type' => 'Organization', 'name' => 'Sarana Law Firm', 'url' => home_url('/')),
        );
        if ($img) {
            $article['image'] = $img;
        }
        echo '<script type="application/ld+json">' . wp_json_encode($article, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "</script>\n";
    }
    $faq = json_decode((string) get_post_meta($pid, '_slf_aa_faq', true), true);
    if ($faq) {
        $ents = array();
        foreach ($faq as $f) {
            $ents[] = array('@type' => 'Question', 'name' => $f['q'], 'acceptedAnswer' => array('@type' => 'Answer', 'text' => $f['a']));
        }
        echo '<script type="application/ld+json">' . wp_json_encode(array('@context' => 'https://schema.org', '@type' => 'FAQPage', 'mainEntity' => $ents), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "</script>\n";
    }
}, 5);

/* ---------- Admin page (Tools → SLF Auto Articles) ---------- */

add_action('admin_menu', function () {
    add_management_page('SLF Auto Articles', 'SLF Auto Articles', 'manage_options', 'slf-auto-articles', 'slf_aa_admin');
});

add_action('admin_post_slf_aa_action', function () {
    if (!current_user_can('manage_options')) {
        wp_die('Tidak diizinkan');
    }
    check_admin_referer('slf_aa_action');
    $msg = '';
    if (isset($_POST['sync'])) {
        delete_transient('slf_aa_lock');
        $n = slf_aa_sync();
        $msg = "Sinkron selesai: $n artikel baru.";
    } elseif (isset($_POST['save'])) {
        update_option('slf_aa_author', absint($_POST['author'] ?? 0));
        update_option('slf_aa_paused', empty($_POST['paused']) ? 0 : 1);
        $msg = 'Pengaturan disimpan.';
    }
    wp_safe_redirect(add_query_arg(array('page' => 'slf-auto-articles', 'msg' => rawurlencode($msg)), admin_url('tools.php')));
    exit;
});

function slf_aa_admin()
{
    $last = (int) get_option('slf_aa_last_sync', 0);
    $next = wp_next_scheduled('slf_aa_sync');
    $posts = get_posts(array('post_type' => 'post', 'post_status' => array('publish', 'future'), 'meta_key' => '_slf_aa_id', 'numberposts' => 15));
    ?>
    <div class="wrap">
        <h1>SLF Auto Articles</h1>
        <?php if (!empty($_GET['msg'])) : ?><div class="notice notice-success"><p><?php echo esc_html(wp_unslash($_GET['msg'])); ?></p></div><?php endif; ?>
        <p>Artikel SEO ditulis otomatis setiap pagi (3 artikel/hari), lalu diimpor dari GitHub dan tayang pukul 07.00, 12.00, dan 17.00 WIB. Semua artikel bisa diedit atau dihapus seperti post biasa; artikel yang dihapus tidak akan diimpor ulang.</p>
        <p><strong>Sumber:</strong> <code><?php echo esc_html(SLF_AA_SOURCE . 'index.json'); ?></code><br>
        <strong>Sinkron terakhir:</strong> <?php echo $last ? esc_html(wp_date('d M Y H:i', $last)) : 'belum pernah'; ?> &nbsp;·&nbsp;
        <strong>Berikutnya:</strong> <?php echo $next ? esc_html(wp_date('d M Y H:i', $next)) : '-'; ?></p>
        <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
            <?php wp_nonce_field('slf_aa_action'); ?>
            <input type="hidden" name="action" value="slf_aa_action">
            <table class="form-table">
                <tr><th>Penulis artikel</th><td><?php wp_dropdown_users(array('name' => 'author', 'selected' => slf_aa_author(), 'capability' => array('edit_posts'))); ?></td></tr>
                <tr><th>Jeda impor</th><td><label><input type="checkbox" name="paused" value="1" <?php checked(get_option('slf_aa_paused')); ?>> Hentikan sementara impor artikel baru</label></td></tr>
            </table>
            <p><button class="button button-primary" name="save" value="1">Simpan</button> <button class="button" name="sync" value="1">Sinkron sekarang</button></p>
        </form>
        <h2>Artikel otomatis terbaru</h2>
        <table class="widefat striped"><thead><tr><th>Judul</th><th>Status</th><th>Tanggal tayang</th></tr></thead><tbody>
        <?php foreach ($posts as $p) : ?>
            <tr><td><a href="<?php echo esc_url(get_edit_post_link($p->ID)); ?>"><?php echo esc_html($p->post_title); ?></a></td>
            <td><?php echo $p->post_status === 'future' ? 'Terjadwal' : 'Tayang'; ?></td>
            <td><?php echo esc_html(get_the_date('d M Y H:i', $p)); ?></td></tr>
        <?php endforeach; ?>
        <?php if (!$posts) : ?><tr><td colspan="3">Belum ada.</td></tr><?php endif; ?>
        </tbody></table>
        <h2>Log</h2>
        <pre style="background:#fff;border:1px solid #ccd0d4;padding:10px;max-height:300px;overflow:auto"><?php echo esc_html(implode("\n", get_option('slf_aa_log', array()))); ?></pre>
    </div>
    <?php
}
