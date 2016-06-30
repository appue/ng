'use strict';
Ajmd
.factory('storagePool', function (
) {

	var fetchItem = function (key) {
		if (!key) return null;

		var itemStr = localStorage.getItem('ajmd_'+ key),
			item;
		
		try {
			item = JSON.parse(itemStr);
		} catch (e) {
			console.log('error');
		}
		
		if (!item) return null;

		return item;
	},
	oday = 24 * 60 * 60 * 1000;
	
	return {
		/**
		 * 设置本地存储的值
		 * @params:
		 * key: 本地存储的name
		 * data: 存储的对象
		 * expires: 过期时间(可选),以天为单位
		 */
		push: function (key, data, expires) {
			if (!key || !data) return;
			
			var item = fetchItem(key) || {};	
			
			item.value = data || undefined;
			item.expired = expires ? (Date.now() + oday*expires) : undefined;
			
			localStorage.setItem('ajmd_'+key, JSON.stringify(item));
		},

		/**
		 * 获取本地存储的值
		 * @params:
		 * key: 存储的name
		 *
		 * expried如果存在，则判断是否过期，不存在就是永久值
		 */
		pull: function (key) {
			var item = fetchItem(key),
				data;	

			if (!item || item.expired && item.expired <= Date.now()) {
				return null;
			} else {
				return item.value;
			}
		},
		
		/**
		 * 删除本地存储
		 * @params:
		 * key: 本地存储的name
		 * rep: 值对象: {key: 1} 这里只接受value值为对象的情况
		 */
		remove: function (key, rep) {
			if (!key) return;	
		
			var self = this,
				item = fetchItem(key);
			
			if (!item || !rep) {
				localStorage.removeItem('ajmd_'+ key);
				return;
			}
			
			angular.forEach(rep, function (v, k) {
				if (item.value && item.value[k]) {
					item.value[k] = undefined;
					self.push(key, item.value);
				}
			});
		},

		/**
		 * 修改本地存储
		 * @params:
		 * key: 存储的name 
		 * res: 需要修改的属性对象: {key: 1} 这里只接受value为对象的情况
		 */
		modify: function (key, res) {
			if (!key) return;
			
			var self = this,
				item = fetchItem(key),
				i;
			
			if (!item) {
				self.remove(key);
				return;
			}
			
			if (res) {
				angular.forEach(res, function (v, k) {
					if (item.value[k]) item.value[k] = v;
				});
				
				self.push(key, item.value);
			}
		}

	};
});
