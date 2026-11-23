<?php
require __DIR__.'/_guard.php'; admin_start('會員管理');
$rows=$pdo->query('SELECT member_id,name,email,role,created_at FROM members ORDER BY created_at DESC')->fetchAll();
echo '<div class="table-responsive"><table class="table table-striped"><tr><th>ID</th><th>姓名</th><th>Email</th><th>權限</th><th>註冊時間</th></tr>';
foreach($rows as $r) echo '<tr><td>'.h($r['member_id']).'</td><td>'.h($r['name']).'</td><td>'.h($r['email']).'</td><td>'.h($r['role']).'</td><td>'.h($r['created_at']).'</td></tr>';
echo '</table></div>'; admin_end();
