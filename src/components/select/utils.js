import jeasy from 'jeasy';

// 将组件children转换成带label|value的对象数组
export const formatOptionSource = data => {
	const result = [];
	if (jeasy.type(data) === 'object') {
		result.push({
			label: data.children,
			value: data.value
		});
	}
	return result;
};

export const filterOptions = (options, filter) => {
	return options.reduce((acc, child) => {
		const { children } = child.props;
		const label = Array.isArray(children) ? children.find(v => typeof v === 'string' || typeof v === 'number') : children;
		if (label && String(label).indexOf(filter) > -1) {
			acc.push(child);
		}
		return acc;
	}, []);
};
