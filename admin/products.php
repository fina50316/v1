<?php
require __DIR__.'/_guard.php'; admin_start('商品管理');
$rows=$pdo->query('SELECT product_id,name,city,category,price,is_active FROM products ORDER BY product_id DESC')->fetchAll();
echo '<div class="table-responsive"><table class="table table-striped"><tr><th>ID</th><th>商品</th><th>城市</th><th>分類</th><th>價格</th><th>上架</th></tr>';
foreach($rows as $r) echo '<tr><td>'.h($r['product_id']).'</td><td>'.h($r['name']).'</td><td>'.h($r['city']).'</td><td>'.h($r['category']).'</td><td>'.h($r['price']).'</td><td>'.($r['is_active']?'是':'否').'</td></tr>';
echo '</table></div>'; admin_end();
