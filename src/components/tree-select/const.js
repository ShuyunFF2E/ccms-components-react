import { prefixCls } from '@utils';

export const selector = `${prefixCls}-tree-select`;

export const getOpenKeys = (selected, nodes) => {
	const keys = [];
	const getKeys = data => {
		data.forEach(v => {
			if (v.children && v.children.length) {
				const child = v.children.find(i => i.value === selected.value);
				if (child) keys.push(v.value);
				getKeys(v.children);
			}
		});
	};
	getKeys(nodes);
	return keys;
};

export const DEFAULT = 'default';
export const SINGLE = 'single';
export const MULTIPLE = 'multiple';
