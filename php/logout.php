<?php
require __DIR__.'/database.php'; $_SESSION=[]; session_destroy(); json_response(['success'=>true,'message'=>'已登出。']);
