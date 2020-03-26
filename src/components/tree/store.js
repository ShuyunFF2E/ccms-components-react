/**
 * Tree数据管理
 * store.js
 * wangbo
 * 2019-07-22
 */
import jEasy from 'jeasy';
import Message from '../message';

class Store {
	// 当前节点
	activeNode = null;

	/**
	 * 初始化数据
	 * @param treeData
	 * @param maxLevel
	 * @param selectedValue
	 * @param isUnfold
	 * @returns {*}
	 */
	initData = (treeData, maxLevel, selectedValue, isUnfold) => {
		// 单选则直接选中回显值，多选则默认第一个
		this.activeNode = selectedValue && selectedValue[0];
		// 处理已选中的节点，treeData中存在selectedValue中的值则选中
		const cloneData = jEasy.clone(treeData);

		// 递归向上查找选择
		const upFind = currentNode => {
			// eslint-disable-next-line no-param-reassign
			currentNode.indeterminate = true;
			// 被选节点没有子节点则找到父节点对其进行半选
			const pNode = this.findNodeById(cloneData, currentNode.pId);
			// 没有父节点则不再查找
			if (!pNode) {
				return;
			}
			pNode.indeterminate = true;
			// 如果子节点全部选中则父节点选中
			if (pNode.children.every(x => x.checked)) {
				pNode.checked = true;
			}
			upFind(pNode);
		};

		// 递归向下查找选择
		const downFind = currentNode => {
			// eslint-disable-next-line no-param-reassign
			currentNode.checked = true;
			// 没有子节点则不再进行查找
			if (!currentNode.children || !currentNode.children.length) {
				return;
			}
			currentNode.children.forEach(son => {
				// eslint-disable-next-line no-param-reassign
				son.checked = true;
				downFind(son);
			});
		};

		// 递归格式化数据
		const format = (node, level) => {
			const { children } = node;
			const tmp = node;
			// 增加层级
			tmp.level = level;
			// 增加是否展开标志
			tmp.isUnfold = isUnfold;

			// 根节点默认展开
			if (!node.pId) {
				tmp.isUnfold = true;
			}

			// 存在已选中节点，则根节点半选
			if (selectedValue && selectedValue.length && !node.pId) {
				tmp.indeterminate = true;
			}
			if (!children) {
				tmp.children = [];
			}

			// 超过最大层级的节点将不允许新增节点
			if (maxLevel && node.level >= maxLevel) {
				tmp.disableAdd = true;
			}

			// 找到treeData中对应的值进行选中
			const activeNodeIndex = selectedValue && selectedValue.findIndex(x => x.id === tmp.id);
			if (activeNodeIndex !== -1) {
				// 当前节点选中
				tmp.checked = true;
				// 被选中的元素有子节点，则子节点全部选中
				if (tmp.children.length) {
					downFind(tmp);
				} else {
					// 被选节点没有子节点则找到父节点对其进行半选
					upFind(tmp);
				}
			}

			if (!children || !children.length) {
				return node;
			}
			children.forEach(item => {
				format(item, node.level + 1);
			});
			return node;
		};
		if (cloneData.length) {
			cloneData.map(item => {
				return format(item, 1);
			});
		}
		return cloneData;
	};

	/**
	 * 单选选中
	 * @param data
	 * @param node
	 * @returns {Array}
	 */
	selectedForRadio = (data, node) => {
		const selectedList = [];

		function getSelected(nodeList) {
			nodeList.some(item => {
				if (node.id === item.id) {
					selectedList.push(item);
				}
				if (item.children && item.children.length) {
					return getSelected(item.children);
				}
				return false;
			});
		}

		getSelected(data);
		return selectedList;
	};

	/**
	 * 多选选中
	 * @param data
	 * @param node
	 * @returns {*}
	 */
	selectedForCheckbox(data, node) {
		const { checked, children, pId, parentId } = node;
		// eslint-disable-next-line no-param-reassign
		node.indeterminate = false;
		// 变更自身节点选中状态
		if (node.children && node.children.length) {
			node.children.forEach(item => {
				if (!item.checked) {
					const tmpNode = node;
					tmpNode.checked = checked;
					tmpNode.indeterminate = false;
				}
			});
		}

		// 变更子项选中状态
		const changeChildren = child => {
			child.forEach(item => {
				const tmp = item;
				tmp.checked = checked;
				tmp.indeterminate = false;
				const itemChildren = item.children;
				if (itemChildren && itemChildren.length) {
					changeChildren(itemChildren);
				}
			});
		};

		// 变更父项选中状态
		const changeParent = pNodeId => {
			const parentNode = this.findNodeById(data, pNodeId);
			// 无父节点
			if (!parentNode) {
				return;
			}
			let childrenCheckedNumber = 0;
			let childrenIndeterminateNumber = 0;

			parentNode.children.forEach(item => {
				// 子项中有被选中的节点childrenCheckedNumber则加1
				if (item.checked) {
					childrenCheckedNumber += 1;
				}
				// 子项存在部分选中节点则父节点部分选中
				if (item.indeterminate) {
					parentNode.indeterminate = true;
					childrenIndeterminateNumber += 1;
				}
			});

			if (childrenCheckedNumber === 0 && childrenIndeterminateNumber === 0) {
				// 子项全部未选中
				parentNode.checked = false;
				parentNode.indeterminate = false;
			} else if (childrenCheckedNumber === parentNode.children.length) {
				// 子项全部选中
				parentNode.checked = true;
				parentNode.indeterminate = false;
			} else {
				// 子项部分选中
				parentNode.checked = false;
				parentNode.indeterminate = true;
			}

			if (parentNode.pId || parentNode.parentId) {
				changeParent(parentNode.pId || parentNode.parentId);
			}
		};

		changeChildren(children || []);
		changeParent(pId || parentId);
		return data;
	}

	/**
	 * 根据参数获取节点
	 * @param data
	 * @param param
	 * @param value
	 * @returns {*}
	 */
	findNodeByParam = (data, param, value) => {
		let node = null;
		const find = array => {
			array.some(item => {
				if (item[param] === value) {
					node = item;
					return true;
				}
				if (item.children && item.children.length) {
					return find(item.children);
				}
				return false;
			});
		};
		find(data);
		return node;
	};

	/**
	 * 根据id获取节点
	 * @param data
	 * @param id
	 * @returns {*}
	 */
	findNodeById(data, id) {
		return this.findNodeByParam(data, 'id', id);
	}

	/**
	 * 根据id更新节点数据
	 * @param data
	 * @param id
	 * @param updatePart
	 */
	updateNodeById(data, id, updatePart) {
		const node = this.findNodeById(data, id);
		return node && Object.assign(node, updatePart);
	}

	/**
	 * 更新激活节点
	 * @param data
	 * @param node
	 */
	updateActiveNode(data, node) {
		if (this.activeNode) {
			this.updateNodeById(data, this.activeNode.id, { isActive: false });
		}
		this.activeNode = this.updateNodeById(data, node.id, { isActive: true });
	}

	/**
	 * 收起/展开节点
	 * @param data
	 * @param node
	 */
	onFoldNode(data, node) {
		this.updateNodeById(data, node.id, { isUnfold: !node.isUnfold });
		return data;
	}

	/**
	 * 新增节点
	 * @param data
	 * @param pId
	 * @param newNode
	 * @param isAddFront
	 */
	addChildNode(data, pId, newNode, isAddFront) {
		const pNode = this.findNodeById(data, pId);

		if (!pNode.children) {
			pNode.children = [];
		}
		if (isAddFront) {
			pNode.children.unshift(newNode);
			Message.success('添加成功');
			return data;
		}
		pNode.children.push(newNode);
		Message.success('添加成功');
		return data;
	}

	/**
	 * 名称重复校验
	 * @param data
	 * @param name
	 * @returns {*}
	 */
	checkRepeatName(data, name) {
		const sameNode = this.findNodeByParam(data, 'name', name);
		// 名称重复检测
		if (sameNode && sameNode.name === name) {
			Message.error('该名称节点已存在！');
			return true;
		}
		return false;
	}

	/**
	 * 删除节点
	 * @param data
	 * @param node
	 * @returns {*}
	 */
	removeChildNode(data, node) {
		const parentNode = this.findNodeById(data, node.pId || node.parentId);

		// 存在子节点则不可删除
		if (!parentNode || node.children.length) {
			Message.error('该目录存在子目录，不可删除!');
			return data;
		}
		parentNode.children.forEach((child, index) => {
			if (child.name === node.name) {
				parentNode.children.splice(index, 1);
			}
		});
		return data;
	}

	/**
	 * 重命名节点
	 * @param data
	 * @param id
	 * @param newValue
	 * @returns {*}
	 */
	renameChildNode(data, id, newValue) {
		const item = this.findNodeById(data, id);
		item.name = newValue;
		return data;
	}

	/**
	 * 搜索节点
	 * @param data
	 * @param searchText
	 */
	searchNode(data, searchText) {
		const cloneData = jEasy.clone(data);
		// 搜索前删除掉已激活的节点
		this.activeNode = null;

		const search = node => {
			return node.filter(item => {
				const tmp = item;
				tmp.isUnfold = true;
				if (item.name.indexOf(searchText) !== -1) {
					return item;
				}
				if (item.children && item.children.length) {
					tmp.children = search(tmp.children);
					return item.children.length > 0;
				}
				return !item.children.length && item.name.indexOf(String(searchText)) !== -1;
			});
		};
		search(cloneData);
		return cloneData;
	}
}

const store = new Store();
export default store;
