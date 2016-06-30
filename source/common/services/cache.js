'use strict';
Ajmd
// 缓存 
.factory('cachePool', function (
	$cacheFactory
) {
	var myCache = $cacheFactory('cachePool');
	
	return {
		/**
		 * 获取缓存数据
		 * @params:
		 * key: string类型，缓存对象中的值名称
		 */
		get: function (key) {
			if (!key) return;

			var result = myCache.get('Ajmd_'+ key) || false;	
			
			return result;
		},
		
		/**
		 * 写入缓存池
		 * @params:
		 * key: string类型，缓存对象中的值名称
		 * value: 所有类型，缓存对象中的值
		 */
		put: function (key, value) {
			if (!angular.isString(key)) return;
			
			var result = myCache.put('Ajmd_'+ key, value) || false;
			
			return result;
		},
		
		/**
		 * 移除缓存
		 * @params:
		 * key: string类型，缓存对象中的值的名称,key存在删除改缓存，不存在删除所有缓存
		 */
		remove: function (key) {
			if (!angular.isString(key)) return;

			if (key) {
				myCache.remove('Ajmd_'+ key);
			} else {
				myCache.removeAll();
			}	
		}
	};
});
