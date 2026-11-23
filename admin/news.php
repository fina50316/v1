<?php
require __DIR__.'/_guard.php'; admin_start('最新消息管理');
$rows=$pdo->query('SELECT news_id,title,category,published_at,is_published FROM news ORDER BY published_at DESC')->fetchAll();
echo '<div class="table-responsive"><table class="table table-striped"><tr><th>ID</th><th>標題</th><th>分類</th><th>發布時間</th><th>狀態</th></tr>';
foreach($rows as $r) echo '<tr><td>'.h($r['news_id']).'</td><td>'.h($r['title']).'</td><td>'.h($r['category']).'</td><td>'.h($r['published_at']).'</td><td>'.($r['is_published']?'已發布':'未發布').'</td></tr>';
echo '</table></div>'; admin_end();
