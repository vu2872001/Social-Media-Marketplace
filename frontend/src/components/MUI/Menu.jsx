import {
  MenuList,
  MenuItem,
  Avatar,
  Typography,
  Tooltip,
} from '@mui/material';
import React from 'react';
import { makeStyles } from 'tss-react/mui';
import { BetterIconButton } from './Button/IconButton';
import './MUI.css';
import { Helper } from '../../utils/Helper';

const useStyles = makeStyles()(() => ({
  scroll: {
    '&::-webkit-scrollbar': {
      width: '1rem',
    },
    '&::-webkit-scrollbar-track': {
      boxShadow: 'inset 0 0 6px rgba(0, 0, 0, 0)',
      borderRadius: '8px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      borderRadius: '8px',
    },
  },
}));

export default function Menu(props) {
  const { classes, cx } = useStyles();
  const {
    list,
    before,
    after,
    left,
    middle,
    right,
    classNameConfig = {},
    ...other
  } = props;

  const {
    menuClass,
    menuItemClass,
    leftClass,
    middleClass,
    rightClass,
  } = classNameConfig;

  return (
    <MenuList
      className={cx(classes.scroll, `menu ${menuClass}`)}
      {...other}
    >
      {before}

      {list?.map((item, index) => (
        <MenuItem
          key={index}
          className={`menu-item ${menuItemClass}`}
          onClick={item.onClick}
        >
          {React.isValidElement(left) ? (
            left
          ) : React.isValidElement(item.left) ? (
            item.left
          ) : Helper.checkPropsInObject(
              item.left,
              ['url', 'name'],
              false
            ) ? (
            <Avatar
              className={`left-menu ${leftClass}`}
              alt={item.left.name}
              src={item.left.url}
            >
              {item.left.name?.at(0)}
            </Avatar>
          ) : (
            Helper.checkPropsInObject(item.left, ['icon'], false) && (
              <BetterIconButton
                tooltip={item.left.tooltip}
                className={`left-menu ${leftClass}`}
                hasBackground={item.left.hasBackground}
              >
                {item.left.icon}
              </BetterIconButton>
            )
          )}

          {React.isValidElement(middle) ? (
            middle
          ) : React.isValidElement(item.middle) ? (
            item.middle
          ) : Helper.checkPropsInObject(
              item.middle,
              ['hasTooltip'],
              false
            ) ? (
            <Tooltip title={item.middle.tooltip}>
              <Typography className={`middle-menu ${middleClass}`}>
                {item.middle.text}
              </Typography>
            </Tooltip>
          ) : (
            <Typography className={`middle-menu ${middleClass}`}>
              {item.middle}
            </Typography>
          )}

          {React.isValidElement(right)
            ? right
            : React.isValidElement(item.right)
            ? item.right
            : Helper.checkPropsInObject(
                item.right,
                ['icon'],
                false
              ) && (
                <BetterIconButton
                  tooltip={item.right.tooltip}
                  className={`right-menu ${rightClass}`}
                  hasBackground={item.right.hasBackground}
                >
                  {item.right.icon}
                </BetterIconButton>
              )}
        </MenuItem>
      ))}

      {after}
    </MenuList>
  );
}
