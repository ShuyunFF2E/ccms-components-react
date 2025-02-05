import React, { useEffect, useRef, useState } from 'react';
import { findTreeNode, selector } from '../const';
import Icon from '../../icon';
import Input from '../../input';
import { getTextWidth } from '../../c-table/util';

export default function MultiSearch({
  placeholder,
  searchValue,
  open,
  onSearchValueChange,
  onMultiChange,
  positionPop,
  selectedList,
  maxTagCount,
  setSearchStatus,
  disabled,
  treeData,
  showPath,
  searchable,
}) {
  const searchRef = useRef();
  const [selectList, setSelectList] = useState([]);

  const onOptionsSearch = evt => {
    onSearchValueChange(evt.target.value);
    const width = getTextWidth(evt.target.value);
    searchRef.current.style.width = `${width || 4}px`;
  };

  const clearSearchValue = () => {
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
  }, [open, selectList.length, searchable]);

  useEffect(() => {
    setSelectList([...selectedList].map(item => findTreeNode(item, treeData)));
    setTimeout(() => {
      positionPop();
    });
  }, [selectedList]);

  const onKeyDown = evt => {
    const keyCode = evt.key;
    if (keyCode === 'Backspace' && !searchValue && selectList.length) {
      const deletedNode = selectList.pop();
      onMultiChange(deletedNode, selectList);
      setSelectList([...selectList]);
      positionPop();
    }
  };

  const onItemClose = (evt, item) => {
    evt.stopPropagation();
    const index = selectList.findIndex(item1 => item1.value === item.value);
    if (index > -1) {
      const deletedNode = selectList.splice(index, 1);
      onMultiChange(deletedNode, selectList);
      setSelectList([...selectList]);
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
          <span style={{ width: 0, zIndex: -1, padding: 0, marginLeft: -4 }}>-</span>
          {showSelectList.map(item => {
            const name = showPath ? item?.path?.join('/') : item?.name;
            return (
              (
                <span key={item.id} className={`${selector}-multiple-search-item ${disabled && 'disabled'}`}>
                  <span className={`${selector}-multiple-search-item-text`} title={name}>{name}</span>
                  {!disabled && <Icon type="close" onClick={evt => onItemClose(evt, item)} />}
                </span>
              )
            );
          })}
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
      {selectList.length || searchValue ? '' : <p className={`${selector}-multi-search-placeholder`}>{placeholder}</p>}
    </div>
  );
}
