<?php
require __DIR__.'/_guard.php'; admin_start('管理總覽');
$tables=['members'=>'會員','messages'=>'留言','products'=>'商品','orders'=>'訂單','news'=>'消息'];
echo '<div class="row g-3">';
foreach($tables as $table=>$label){$n=(int)$pdo->query("SELECT COUNT(*) FROM $table")->fetchColumn();echo '<div class="col-md-4"><div class="card p-3"><h3>'.h($label).'</h3><strong class="fs-2">'.$n.'</strong></div></div>';}
echo '</div><p class="mt-4">此版本提供後台資料檢視；新增、編輯、刪除介面尚待下一階段開發。</p>'; admin_end();
