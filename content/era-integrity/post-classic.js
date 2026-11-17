// Posts one article from index.json into the classic WordPress 4.7 editor of
// eraintegrityindonesia.com (BuatWebProperty-managed: no plugin access).
// Admin: https://www.eraintegrityindonesia.com/kelolah/  (login page: /masuk/)
//
// Use from the Claude desktop app's built-in browser (already logged in):
//   1) navigate to https://www.eraintegrityindonesia.com/kelolah/post-new.php
//   2) javascript_exec: <this whole file> + "\nawait eraPost('<slug>')"
//   3) wait ~5 s, then confirm in /kelolah/edit.php?post_status=future that the post is "Terjadwal".
// Before posting, check edit.php?post_status=all&s=<slug words> so the same article is never posted twice.
// The site's WordPress timezone is UTC (checked 18 Nov 2026), so the schedule uses publish_at_utc.
async function eraPost(slug) {
  const BASE = 'https://raw.githubusercontent.com/dhirajkelly/doktor-trader/main/content/era-integrity/';
  const $ = id => document.getElementById(id);
  if (!$('post_ID') || !/post-new\.php/.test(location.href)) throw new Error('buka /kelolah/post-new.php dulu');
  const idx = await fetch(BASE + 'index.json?t=' + Date.now()).then(r => r.json());
  const it = idx.items.find(i => i.slug === slug);
  if (!it) throw new Error('slug tidak ada di index.json: ' + slug);
  const html = await fetch(BASE + it.html + '?t=' + Date.now()).then(r => r.text());

  // featured image + alt text
  const blob = await fetch(BASE + it.image + '?t=' + Date.now()).then(r => r.blob());
  const fd = new FormData();
  fd.append('async-upload', new File([blob], it.slug + '.png', { type: 'image/png' }));
  fd.append('name', it.slug + '.png');
  fd.append('action', 'upload-attachment');
  fd.append('_wpnonce', _wpPluploadSettings.defaults.multipart_params._wpnonce);
  fd.append('post_id', $('post_ID').value);
  const up = await fetch('/kelolah/async-upload.php', { method: 'POST', body: fd, credentials: 'same-origin' }).then(r => r.json());
  if (!up.success) throw new Error('upload gambar gagal: ' + JSON.stringify(up));
  const att = wp.media.model.Attachment.get(up.data.id);
  await att.fetch();
  await att.save({ alt: it.image_alt, title: it.title });
  wp.media.featuredImage.set(up.data.id);
  for (let i = 0; i < 30 && String($('_thumbnail_id').value) !== String(up.data.id); i++) {
    await new Promise(r => setTimeout(r, 500)); // wait for the set-post-thumbnail ajax to finish
  }

  // title, slug, excerpt
  $('title').value = it.title;
  if ($('title-prompt-text')) $('title-prompt-text').className = 'screen-reader-text';
  $('post_name').value = it.slug;
  $('excerpt').value = it.excerpt;

  // content: write into TinyMCE's body directly (setContent() throws in a hidden pane), then sync to the textarea
  $('content').value = html;
  const ed = window.tinymce && tinymce.get('content');
  if (ed) { ed.getBody().innerHTML = html; ed.save({ no_events: true }); }

  // categories + tags
  document.querySelectorAll('#categorychecklist input').forEach(cb => {
    cb.checked = it.categories.includes(cb.parentElement.innerText.trim());
  });
  $('new-tag-post_tag').value = it.tags.join(', ');
  document.querySelector('#tagsdiv-post_tag .tagadd').click();

  // schedule (UTC)
  const [d, t] = it.publish_at_utc.replace('Z', '').split('T');
  const [Y, M, D] = d.split('-');
  const [h, m] = t.split(':');
  $('aa').value = Y; $('mm').value = M; $('jj').value = D; $('hh').value = h; $('mn').value = m;
  const ok = document.querySelector('#timestampdiv .save-timestamp');
  if (ok) ok.click();
  await new Promise(r => setTimeout(r, 800));

  if (ed) ed.save({ no_events: true });
  const label = $('publish').value;
  window.onbeforeunload = null;
  if (window.jQuery) jQuery(window).off('beforeunload');
  $('publish').click();
  return 'dikirim (' + label + '): ' + it.title + ' → ' + it.publish_at_wib + ' WIB';
}
