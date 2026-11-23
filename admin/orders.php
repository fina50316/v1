<?php
require __DIR__.'/_guard.php'; admin_start('訂單管理');
$rows=$pdo->query('SELECT o.order_id,o.order_no,m.name member_name,o.total_amount,o.status,o.created_at FROM orders o LEFT JOIN members m ON o.member_id=m.member_id ORDER BY o.created_at DESC')->fetchAll();
echo '<div class="table-responsive"><table class="table table-striped"><tr><th>ID</th><th>訂單編號</th><th>會員</th><th>金額</th><th>狀態</th><th>時間</th></tr>';
foreach($rows as $r) echo '<tr><td>'.h($r['order_id']).'</td><td>'.h($r['order_no']).'</td><td>'.h($r['member_name']??'訪客').'</td><td>'.h($r['total_amount']).'</td><td>'.h($r['status']).'</td><td>'.h($r['created_at']).'</td></tr>';
echo '</table></div>'; admin_end();
