<?php
require __DIR__.'/_guard.php'; admin_start('留言管理');
$rows=$pdo->query('SELECT message_id,member_name,email,subject,status,created_at FROM messages ORDER BY created_at DESC')->fetchAll();
echo '<div class="table-responsive"><table class="table table-striped"><tr><th>ID</th><th>姓名</th><th>Email</th><th>主旨</th><th>狀態</th><th>時間</th></tr>';
foreach($rows as $r) echo '<tr><td>'.h($r['message_id']).'</td><td>'.h($r['member_name']).'</td><td>'.h($r['email']).'</td><td>'.h($r['subject']).'</td><td>'.h($r['status']).'</td><td>'.h($r['created_at']).'</td></tr>';
echo '</table></div>'; admin_end();
