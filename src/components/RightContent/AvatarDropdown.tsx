import { userLogout} from '@/services/backend/userController';
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { history, useModel } from '@umijs/max';
import { Avatar, Button, Space } from 'antd';
import type { MenuInfo } from 'rc-menu/lib/interface';
import React, {useCallback} from 'react';
import { flushSync } from 'react-dom';
import { Link } from 'umi';
import HeaderDropdown from '../HeaderDropdown';

export type GlobalHeaderRightProps = {
  menu?: boolean;
};


export const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu }) => {
  /**
   * 退出登录，并且将当前的 url 保存
   */
  const loginOut = async () => {
    await userLogout();
   // const { search, pathname } = window.location;
    const urlParams = new URL(window.location.href).searchParams;
    /** 此方法会跳转到 redirect 参数所在的位置 */
    const redirect = urlParams.get('redirect');
    // Note: There may be security issues, please note
    if (window.location.pathname !== '/user/login' && !redirect) {
      history.replace({
        pathname: '/user/login',
        // search: stringify({
        //   redirect: pathname + search,
        // }),
      });
    }
  };

  // @ts-ignore
  const LoginUser=JSON.parse(localStorage.getItem("LoginUser"))
  const { initialState, setInitialState } = useModel('@@initialState');

  const onMenuClick = useCallback(
    (event: MenuInfo) => {
      const { key } = event;
      if (key === 'logout') {
        flushSync(() => {
          setInitialState((s) => ({ ...s, currentUser: undefined }));
        });
        //清除本地用户数据
        localStorage.removeItem("LoginUser")
        loginOut();
        return;
      }
      history.push(`/account/${key}`);
    },
    [setInitialState],
  );

  const { currentUser } = initialState || {};
 // console.log(currentUser)
  if (!currentUser) {
    return (
      <Link to="/user/login">
        <Button type="primary" shape="round">
          登录
        </Button>
      </Link>
    );
  }

  const menuItems = [
    ...(menu
      ? [
          {
            key: 'center',
            icon: <UserOutlined />,
            label: '个人中心',
          },
          {
            key: 'settings',
            icon: <SettingOutlined />,
            label: '个人设置',
          },
          {
            type: 'divider' as const,
          },
        ]
      : []),
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '个人设置',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },

  ];

  return (
    <HeaderDropdown
      menu={{
        selectedKeys: [],
        onClick: onMenuClick,
        items: menuItems,
      }}
    >
      <Space>
        {/*{LoginUser?.avatarUrl ? (*/}
        {/*  <Avatar   size='small'*/}
        {/*           src={LoginUser?.avatarUrl || 'https://img0.baidu.com/it/u=3910541082,378875540&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'} />*/}
        {/*) : (*/}
        {/*  <Avatar size="small" icon={<UserOutlined />} />*/}
        {/*)}*/}
        <Avatar
          size='small'
         src={LoginUser?.avatarUrl || 'https://img0.baidu.com/it/u=3910541082,378875540&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'}
        />
        <span className="anticon">{LoginUser?.userName ?? '无名'}</span>
      </Space>
    </HeaderDropdown>
  );
};

export const AvatarName = () => {};
