import React, { useEffect, useRef, useState } from 'react';
import { selector } from '../common';
import Icon from '../../../icon';
import Input from '../../../input';
import { getTextWidth } from '../../../c-table/util';

export default function MultiSearch({
  selectedList,
  dataSource,
  placeholder,
  searchValue,
  open,
  onSearchValueChange,
  onSearch,
  onMultiChange,
  positionPop,
  maxTagCount,
  setSearchStatus,
  disabled,
  searchable,
  supportUnlimited,
  unlimitedLabel,
  optionRender,
  valueKey,
  labelKey,
}) {
  const searchRef = useRef();
  const [selectList, setSelectList] = useState([]);

  const onOptionsSearch = evt => {
    onSearch(evt.target.value);
    onSearchValueChange(evt.target.value);
    const width = getTextWidth(evt.target.value);
    searchRef.current.style.width = `${width || 4}px`;
  };

  const clearSearchValue = () => {
    onSearch('');
    onSearchValueChange('');
  };

  useEffect(() => {
    if (searchable) {
      if (open) {
        searchRef.current.querySelector('input').focus();
        setSearchStatus(true);
      } else {
        searchRef.current.querySelector('input').blur();
        setSearchStatus(false);
        clearSearchValue();
      }
    }
  }, [open, selectedList, searchable]);

  const getSelectedList = _selectedList => {
    if (optionRender) {
      return dataSource
        .filter(item => _selectedList.map(item1 => item1.value).includes(item[valueKey]))
        .map(item => ({
          ...item,
          label: item[labelKey],
          value: item[valueKey],
        }));
    }
    return _selectedList?.map((item) => {
      // 此处是处理带图标的场景（可查看 demo）
      if (Array.isArray(item.label)) {
        return {
          ...item,
          label: item.label.find((v) => typeof v === 'string'),
        };
      }
      return item;
    }) || [];
  };

  useEffect(() => {
    setSelectList(getSelectedList([...selectedList]));
    setTimeout(() => {
      positionPop();
    });
  }, [selectedList]);

  const onKeyDown = evt => {
    const keyCode = evt.key;
    if (keyCode === 'Backspace' && !searchValue && selectList.length) {
      selectList.pop();
      setSelectList(getSelectedList([...selectList]));
      onMultiChange(selectList.map(i => i.value));
      positionPop();
    }
  };

  const onItemClose = (evt, item) => {
    evt.stopPropagation();
    const index = selectList.findIndex(item1 => item1.value === item.value);
    if (index > -1) {
      selectList.splice(index, 1);
      onMultiChange(selectList.map(i => i.value));
      positionPop();
    }
  };

  const showSelectList = maxTagCount ? selectList.slice(0, maxTagCount) : selectList;
  const hideSelectList = maxTagCount ? selectList.slice(maxTagCount) : [];

  return (
    <div
      className={`${selector}-multi-search-container`}
      onClick={() => {
        if (searchable) {
          searchRef.current.querySelector('input').focus();
          setSearchStatus(true);
        }
      }}
    >
      {selectList?.length ? (
        <>
          <span style={{ width: 0, zIndex: -1, padding: 0, marginLeft: -4, fontSize: 14 }}>-</span>
          {showSelectList.map(item => (
            <span key={item.value} className={`${selector}-multiple-search-item ${disabled && 'disabled'}`}>
              <span className={`${selector}-multiple-search-item-text`} title={item.label}>
                {item.label}
              </span>
              {!disabled && <Icon type="close" onClick={evt => onItemClose(evt, item)} />}
            </span>
          ))}
          {hideSelectList.length ? (
            <span className={`${selector}-multiple-search-item ${disabled && 'disabled'}`}>
              <span className={`${selector}-multiple-search-item-count`}>
                +
                {hideSelectList.length}
              </span>
            </span>
          ) : null}
        </>
      ) : (
        <span style={{ visibility: 'hidden', width: 0, marginLeft: -4 }}>-</span>
      )}
      {searchable && (
        <div ref={searchRef} className={`${selector}-search`}>
          <Input
            disabled={disabled}
            // useComposition
            value={searchValue}
            placeholder=""
            onChange={onOptionsSearch}
            className={`${selector}-search-input`}
            onKeyDown={onKeyDown}
          />
        </div>
      )}
      {selectList.length || searchValue ? '' : (
        <p className={`${selector}-multi-search-placeholder`}>
          {supportUnlimited ? (
            <span className="multi-unlimited">{unlimitedLabel || '不限'}</span>
          ) : placeholder}
        </p>
      )}
    </div>
  );
}
