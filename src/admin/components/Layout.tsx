import type { ReactNode } from 'react';
import {
  AppShell,
  Burger,
  Group,
  NavLink,
  Text,
  Avatar,
  Menu,
  UnstyledButton,
  rem,
  useMantineColorScheme,
  ActionIcon,
  Tooltip,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconCar,
  IconDashboard,
  IconRoute,
  IconBox,
  IconGift,
  IconHandGrab,
  IconSettings,
  IconLogout,
  IconMoon,
  IconSun,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
} from '@tabler/icons-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin');
  };

  const menuItems = [
    { icon: IconDashboard, label: 'Tableau de bord', path: '/admin' },
    { icon: IconRoute, label: 'Trajets', path: '/admin/trips' },
    { icon: IconBox, label: 'Objets', path: '/admin/items' },
    { icon: IconGift, label: 'Récompenses', path: '/admin/rewards' },
    { icon: IconHandGrab, label: 'Demandes de récompenses', path: '/admin/reward-claims' },
    { icon: IconSettings, label: 'Paramètres App', path: '/admin/settings' },
  ];

  return (
    <AppShell
      header={{ height: 70 }}
      navbar={{
        width: desktopOpened ? 280 : 80,
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened, desktop: false },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
            <Tooltip label={desktopOpened ? 'Réduire la sidebar' : 'Étendre la sidebar'}>
              <ActionIcon
                onClick={toggleDesktop}
                variant="subtle"
                size="lg"
                visibleFrom="sm"
              >
                {desktopOpened ? (
                  <IconLayoutSidebarLeftCollapse size={20} />
                ) : (
                  <IconLayoutSidebarLeftExpand size={20} />
                )}
              </ActionIcon>
            </Tooltip>
            <Group gap="xs">
              <IconCar size={32} color="#667eea" stroke={2} />
              <Text size="xl" fw={700} c="#667eea">
                Vago Admin
              </Text>
            </Group>
          </Group>

          <Group>
            <Tooltip label={colorScheme === 'dark' ? 'Mode clair' : 'Mode sombre'}>
              <ActionIcon
                onClick={() => toggleColorScheme()}
                variant="subtle"
                size="lg"
              >
                {colorScheme === 'dark' ? (
                  <IconSun size={20} />
                ) : (
                  <IconMoon size={20} />
                )}
              </ActionIcon>
            </Tooltip>

            <Menu shadow="md" width={200}>
              <Menu.Target>
                <UnstyledButton>
                  <Group gap="xs">
                    <Avatar color="grape" radius="xl">
                      {user?.email?.[0].toUpperCase()}
                    </Avatar>
                    <div style={{ flex: 1 }}>
                      <Text size="sm" fw={500}>
                        Admin
                      </Text>
                      <Text c="dimmed" size="xs">
                        {user?.email}
                      </Text>
                    </div>
                  </Group>
                </UnstyledButton>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item
                  leftSection={<IconLogout size={14} />}
                  color="red"
                  onClick={handleSignOut}
                >
                  Déconnexion
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <AppShell.Section grow>
          {menuItems.map((item) => (
            <Tooltip
              key={item.path}
              label={item.label}
              position="right"
              disabled={desktopOpened}
              withArrow
            >
              <NavLink
                label={desktopOpened ? item.label : ''}
                leftSection={<item.icon size={20} stroke={1.5} />}
                active={location.pathname === item.path}
                onClick={() => {
                  navigate(item.path);
                  toggleMobile();
                }}
                variant="subtle"
                style={{
                  borderRadius: rem(8),
                  marginBottom: rem(5),
                  justifyContent: desktopOpened ? 'flex-start' : 'center',
                }}
              />
            </Tooltip>
          ))}
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
