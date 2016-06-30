'use strict';
Ajmd
// 文本字数过滤器，当文本字数大于指定的最大字符数（maxCount），则只显示前（maxCount - 2）字符，并在其后显示省略号
.filter('ellipsis', function () {
	return function (item, maxCount) {
		if (item && maxCount > 0 && item.length > maxCount) {
			return item.substring(0, maxCount - 2) + '...';
		}
		return item;
	};
})

/**
 * 时间格式化
 * @example:
 * 2015-01-20 08:09:03 | formatTime
 */
.filter('formatTime', function (
    $filter
) {
    return function (dateTime, now) {
        if (!dateTime) return;

        if (!now) now = new Date().getTime();

        var time   = (new Date(dateTime.replace(new RegExp("-", "gm"), "/"))).getTime(),
            diff   = now - time,
            result = '刚刚',
            d      = 24 * 60 * 60 * 1000,
            h      = 60*60*1000,
            m      = 60*1000;

        if (diff > d) {
            // result = dateTime;
            result = Math.floor(diff / d) + '天前';
        } else if (diff > h) {
            result = Math.floor(diff / h) + '小时前';
        } else if (diff > 10*m) {
            result = Math.floor(diff / m) + '分钟前';
        }

        return result;
    };
})

/**
 * 取小数点前面的数
 * @example:
 * num | fixed
 */
.filter('fixed', function () {
	return function (num) {
		if (!num) return;
		
		var result = num.toString().split('.')[0];

		return result;
	};
})

// 只容许输入汉字
.filter('showtext', function () {
	return function (str) {
		if (!str) return;
		return str.replace(/[^\u4E00-\u9FA5]/g,'');
	}
})

/**
 * 根据差秒数，算时间，格式为：0:00:00
 * @example:
 * num | splitTime
 */
.filter('splitTime', function (
	$filter
) {
	return function (num) {
		var h = 3600,
			m = 60,
			th,
			tm,
			ts;	
		
		th = $filter('fixed')(num / h);
				
		if (th === 0) {
			tm = $filter('fixed')(num / m);	
			
			ts = (tm === 0) ? num : num % m;
		} else {
			tm = $filter('fixed')((num % h) / m);
			
			ts = (tm === 0) ? num % h : (num % h) % m;
		}
		
		if (tm < 10) tm = '0'+tm;
		if (ts < 10) ts = '0'+ts;

		return {
			h: th,
			m: tm,
			s: ts
		};
	};
})

/**
 * 替换<br>
 * @example:
 * value | repbr
 */
.filter('repbr', function () {
    return function (text) {
    	if (!text) return;

        var reg = new RegExp("<br>","g");

        return text.toString().replace(reg, '\n');
    };
})

/**
 * 替换回车
 * @example:
 * value | repenter
 */
.filter('repenter', function () {
    return function (text) {
    	if (!text) return;

        var reg = new RegExp("\n","g");

        return text.replace(reg, '<br>');
    };
})

/**
 * 设置单词首字母大写
 * @example:
 * value | upper
 */
.filter('upper', function () {
    return function (str) {
        return str.replace(/\b(\w)|\s(\w)/g, function(str){  
            return str.toUpperCase();  
        });
    };
})

// url处理
.filter('trusted', ['$sce', function ($sce) {
    return function(url) {
        return $sce.trustAsResourceUrl(url);
    };
}])
// html 处理
.filter('trustHtml', ['$sce', function ($sce) {
    return function(str) {
        return $sce.trustAsHtml(str);
    };
}])

// 用*号替换字
.filter('hidestar', function () {
	return function (str) {
		str = str.toString();
		var len = str.length;
		if (len == 2) {
			str = str.replace(str.slice(1,2), '*');
		}
		if (len == 3) {
			str = str.replace(str.slice(1,2), '*');
		}
		if (len == 4) {
			str = str.replace(str.slice(1,3), '**');
		}
		if (len == 11) {
			str = str.replace(str.slice(3,7), '****');
		}
		if (len == 15) {
			str = str.replace(str.slice(3,11), '********');
		}
		if (len == 18) {
			str = str.replace(str.slice(3,14), '***********');
		}
		return str;
	}
})

/**
 * 获取图片的原始高宽
 * http://img-ossimg.ajmide.com/upload/201601/06/14865--568d0ace14eca_800x499.jpg
 */
.filter('img', function () {
	return function (url) {
		if (!url) return null;

		var arr = url.match(/_.*\.jpg$/g);

		if (!arr || arr.length == 0) return true;

		arr = arr[0].replace(/\.jpg/g, '').replace(/_/g, '').split('x');

		return {
			w: arr[0],
			h: arr[1]
		};
	};
})

/**
 * 删除评论中的图片
 * ****<br><img .....
 */
.filter('rmimg', function () {
	return function (text) {
		if (!text) return null;

		text = text.replace(/<img.*\/>/g, '').replace(/<br>/g, '');

		return text;
	};
})

/**
 * 判断是否为黄金会员
 * 3385-level-1A8F3H.png
 */
.filter('isGold', function () {
	return function (url) {
		if (!url) return '';

		var arr = url.match(/3385-level-1A8F3H\.png/g);

		if (!arr || arr.length == 0) return '';

		return 'gold';
	};
})

/**
 * 帖子或评论中的图片string 转成 obj array
 */
.filter('imglist', function (
	$filter,
	$rootScope
) {
	return function (str, type) {
		var result = [];

		if (!str) return result;

		if (type) {
			var obj = JSON.parse(str);

			if (obj.t && obj.t == 'img') {
				var w = $rootScope.screenWidth - 20;

				angular.forEach(obj.files, function (v, k) {
					var obj = $filter('img')(v.url);

					if (!obj) return;

					if (!angular.isObject(obj)) {
						v._url = v.url +'@'+ w +'w_1e_1c';
						result.push(v);
						return;
					}

					var iw,
						ih;

					if (obj.w <= w) {
						iw = obj.w;
						ih = obj.h;
					} else {
						iw = w;
						ih = Math.floor(obj.h*w/obj.w);
					}

					v.style = {
						width: iw+'px',
						height: ih+'px'
					};

					v._url = v.url +'@'+ ih +'h_'+ iw +'w_1e_1c';

					result.push(v);
				});
			}

		} else {
			if (JSON.parse(str).t && JSON.parse(str).t == 'img') {
				result = JSON.parse(str).files;
			}
		}

		return result;
	};
})

/**
 * 阿里云 图片色值获取
 * { RGB: "0x9b9569" }
 */
.filter('imgColor', function () {
	return function (res) {
		var result;

		if (!res || !res.data || !res.data['RGB']) return;

		var str = res.data['RGB'].replace(/0x/g, ''),
			r = str.slice(0, 2),
			g = str.slice(2, 4),
			b = str.slice(4, 6);

		result = {
			r: parseInt(r, 16),
			g: parseInt(g, 16),
			b: parseInt(b, 16)
		};

		return result;
	};
})

/**
 * 去掉图片地址后面的阿里云切割参数
 */
.filter('delcut', function () {
	return function (img) {
		if (!img) return;

		img = img.replace(/@.*/g, '');

		return img;
	};
})

/**
 * 返回微信预览图片的地址
 * @params: {}
 * url: imgurl
 */
.filter('preview', function () {
	return function (obj) {
		var arr = [];

		angular.forEach(obj, function (v, k) {
			arr.push(v.url);
		});
		
		return arr;
	};
})

/**
 * 用户图像切割地址
 * @80h_80w_1e_1c
 */
.filter('cutuserimage', function () {
	return function (str) {
		var src;
		
		if (/wx\.qlogo\.cn/.test(str)) {
			src = str;
		} else {
			src = str +'@80h_80w_1e_1c';
		}

		return src;
	};
})


/**
 * 过滤微信用户昵称
 * _WX.*
 */
.filter('wxusername', function () {
	return function (str) {
		if (!str) return;

		var name = str.replace(/_WX.*$/g, '(来自微信)');

		return name;
	};
});
