'use strict';
Ajmd
// input 输入校验 只能输入数字、中划线
.filter('inputMobile', function () {
	return function (str) {
		if (!str) return;
		
		return str.replace(/[^\d-]/g, '');
	};
})

// 乘以0.7，保留两位小数点
.filter('inputMoney', function (
    compute
) {
	return function (num) {
		if (!num) return;

		var result = compute.mul(num, 0.7),
			arr = result.toString().split('.');

		if (arr.length >= 2) {
			if (arr[1].length > 2) {
				var str1 = arr[1].substring(0,2),
					str2 = arr[1].substring(2,3);

				var str3 = Math.round(Number(str1+'.'+str2));

				if (str3.toString().length == 1) {
					str3 = '0'+str3;
				}
				
				return Number(arr[0]+'.'+str3);
			}
		}

		return result;
	}
})

// 验证两位小数
.filter('decimal', function () {
	return function (num) {
		if (!num) return null;

		var result = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/.test(num);

		return result;
	}
})
.filter('showdecimal', function () {
	return function (num) {
		if (!num) return;

		var result = num.replace(/[^\d.]/g, '').replace(/^\./g, "").replace(/^0(\d)/g, '$1').replace(/\.{2,}/g, ".").replace(".", "$#$").replace(/\./g, "").replace("$#$", ".").replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');

		return result;
	}
});
