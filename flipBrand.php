<?php
$prize = '[
{"id":1,"prize":"平板电脑","PR":1},
{"id":2,"prize":"数码相机","PR":5},
{"id":3,"prize":"音箱设备","PR":10},
{"id":4,"prize":"4G优盘","PR":12},
{"id":5,"prize":"10Q币","PR":22},
{"id":6,"prize":"下次没准就能中哦","PR":50}
]';

function flipBrand($prize) {

	function getPrize($prize) {
		# code...
		//生成奖品的 id=>概率 数组$arr
		$prize_arr = json_decode($prize, true);
		foreach ($prize_arr as $key => $val) {
			$arr[$val['id']] = $val['PR'];
		}

		//根据概率获取中奖id
		$prizeId = get_rand($arr);

		//提取中奖项
		$res['yes'] = $prize_arr[$prizeId - 1]['prize'];
		//将中奖项从数组中剔除，剩下未中奖项
		unset($prize_arr[$prizeId - 1]);
		//打乱数组顺序
		shuffle($prize_arr);

		for ($i = 0; $i < count($prize_arr); $i++) {
			$noprize[] = $prize_arr[$i]['prize'];
		}
		//提取未中奖项
		$res['no'] = $noprize;

		//返回中奖信息
		return $res;

	}

	function get_rand($proArr) {
		//奖品id
		$result = '';

		//奖品id=>概率 数组的总概率精度
		$proSum = array_sum($proArr);

		//概率数组循环
		foreach ($proArr as $key => $proCur) {
			//从总概率中 随机生成一个概率
			$randNum = mt_rand(1, $proSum);
			//如果随机概率落在当前概率中，获取当前概率数组的奖品id，并终止循环
			//否则从总概率中减去当前概率。
			if ($randNum <= $proCur) {
				$result = $key;
				break;
			} else {
				$proSum -= $proCur;
			}
		}
		//删除概率数组
		unset($proArr);

		//返回奖品id
		return $result;
	};

	//输出json格式化的中奖信息
	echo json_encode(getPrize($prize));

}
//输出随机生成的中奖信息
flipBrand($prize);
?>