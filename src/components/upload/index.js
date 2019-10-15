import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Message from '../message';
import Icon from '../icon';
import Button from '../button';

import UploadList from './list';
import getUuid from './utils';
import defaultHttp from './http';
import { TYPE, PREFIX } from './constant';

import './index.less';

const Text = props => {
	return (
		<Button type="normal">
			<Icon type="upload" style={{ fontSize: '14px', marginRight: '8px' }} />
			<span>{ props.labelText }</span>
		</Button>
	);
};

const Picture = props => {
	return (
		<div>
			<Icon type="plus" style={{ fontSize: '24px' }} />
			<div className={`${PREFIX}-text`}>{ props.labelText }</div>
		</div>
	);
};

class Upload extends Component {

    requests = {};

    constructor(props) {

		super(props);

		this.ref = createRef();

		this.state = {
			fileList: props.fileList || []
		}
	}

	static getDerivedStateFromProps(props, state) {
		
		if (props.fileList && (props.fileList !== state.fileList)) {
			return {
				fileList: props.fileList
			}
		}
		return null;
	}

	componentWillUnmount() {
		this.abort();
	}

	onClick = () => {
		const element = this.ref.current;
		if (!element) return;

		element.click();
	}

	getFileList() {
		return this.ref.current.files;
	}

    handleChange = () => {

        // 已选择文件数量校验，如果没有选择文件的时候不允许点击上传按钮
        const number = this.getFileList().length;

        if (number === 0) return;
        
		this.handleUplaod();
	}

    handleUplaod = () => {

		const fileList = this.getFileList();

		Array.from(fileList).map(file => {
            // eslint-disable-next-line
            file.id = getUuid();
            return file;
        })
        .forEach(file => {
            this.upload(file, fileList);
        });
	}

	handleRemove = file => {
        
        const { onRemove } = this.props;
        
		if (onRemove) {
			onRemove({
				file,
				fileList: this.state.fileList
			});
		}
	};

	handleProgress = (event, file) => {
		
		const item = file;
		item.percent = event.percent;

		const { onProgress } = this.props;
		if (onProgress) {
			onProgress({ file: item });
		}
	};

	handleSuccess = (response, file) => {
		
		try {
			if (typeof response === 'string') {
				// eslint-disable-next-line
				response = JSON.parse(response);
			}
		} catch(e) {
			console.warn(e);
		}

		const item = file;
		item.response = response;

		const { onSuccess } = this.props;

		if(onSuccess) {
			onSuccess({ file: item, fileList: this.state.fileList });
		}
	};

	handleError = (error, file) => {
		
		const item = file;
		item.error = error;

		const { onError } = this.props;

		if (onError) {
			onError({ file: item, fileList: this.state.filelist });
		}
	};

    /**
     * 文件上传之前校验大小是否符合
     */
    handleBeforeUpload(file) {

        const { size } = this.props;

        const isSizeInvalidate = file.size / 1024 / 1024 > size;
        if (isSizeInvalidate) {
            Message.error(`文件过大，最大支持 ${size} M 的文件上传！`);
            return false;
        }

		if (this.props.onBeforeUpload) {
			return this.props.onBeforeUpload(file);
        }
        return true;
    }

    upload(file) {

        const before = this.handleBeforeUpload(file);

        if (before) {
            this.post(file);
        }
    }

    post(file) {

        const { action, headers, withCredentials, customRequest } = this.props;
        const request = customRequest || defaultHttp;
        const { id } = file;

        const option = {
            action,
            filename: file.name,
            file,
            headers,
            withCredentials,
            onProgress: event => {
				this.handleProgress(event, file);
            },
            onSuccess: (response, xhr) => {
                delete this.requests[id];
                this.handleSuccess(response, file, xhr);
            },
            onError: (error) => {
                delete this.requests[id];
                this.handleError(error, file);
            }
        };
		this.requests[id] = request(option);
    }

    abort() {

        Object.keys(this.requests).forEach(id => {

            const req = this.requests[id];
            if (req && req.abort) {
                req.abort();
            }

            delete this.requests[id];
        });
	}

	render() {

		const { type, labelText, accept, disabled, multiple } = this.props;
		const { fileList } = this.state;

		const classes = classNames(PREFIX, {
			[`${PREFIX}-select`]: true,
			[`${PREFIX}-select-${type}`]: true,
			[`${PREFIX}-disabled`]: disabled
		});

		const events = disabled ? {} : {
			onClick: this.onClick
		};

		return (
			<>
				<div className={classes}>
					<span className={PREFIX} role="button" {...events}>
						<input
							style={{ display: 'none' }}
							type="file"
							disabled={disabled}
							ref={this.ref}
							accept={accept}
							multiple={multiple}
							onChange={this.handleChange}
						/>
						{ type === TYPE.DEFAULT ? <Text labelText={labelText} /> : <Picture labelText={labelText} /> }
					</span>
				</div>
				<UploadList type={type} fileList={fileList} onRemove={this.handleRemove} />
			</>
		);
	}
}

Upload.propTypes = {
	type: PropTypes.oneOf([
		TYPE.PICTURE,
		TYPE.DEFAULT
	]),
	labelText: PropTypes.string,
	accept: PropTypes.string,
	size: PropTypes.number,
    disabled: PropTypes.bool,
	fileList: PropTypes.array,
	action: PropTypes.string,
	multiple: PropTypes.bool,
	onBeforeUpload: PropTypes.func,
	onProgress: PropTypes.func,
	onSuccess: PropTypes.func,
	onError: PropTypes.func,
	onRemove: PropTypes.func,
	className: PropTypes.string
};

Upload.defaultProps = {
    type: TYPE.DEFAULT,
	labelText: '选择文件',
	accept: '*',
    size: 1,
    disabled: false,
    fileList: undefined,
    action: '',
    multiple: false,
	onBeforeUpload: undefined,
	onProgress: undefined,
	onSuccess: undefined,
	onError: undefined,
	onRemove: undefined,
	className: ''
};

export default Upload;
