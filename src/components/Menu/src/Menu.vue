<script lang="tsx">
import { computed, defineComponent, unref, PropType, ref, onMounted } from 'vue'
import { ElMenu, ElScrollbar } from 'element-plus'
import { useAppStore } from '@/store/modules/app'
import { usePermissionStore } from '@/store/modules/permission'
import { useRenderMenuItem } from './components/useRenderMenuItem'
import { useRouter } from 'vue-router'
import { isUrl } from '@/utils/is'
import { useDesign } from '@/hooks/web/useDesign'
import { userRole } from '@/api/login'

import { useUserStore } from '@/store/modules/user'
const userStore = useUserStore()
const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('menu')
const result = ref<string[] | null>(null)
export default defineComponent({
  name: 'Menu',
  props: {
    menuSelect: {
      type: Function as PropType<(index: string) => void>,
      default: undefined
    }
  },
  setup(props) {
    const appStore = useAppStore()

    const layout = computed(() => appStore.getLayout)

    const { push, currentRoute } = useRouter()

    const permissionStore = usePermissionStore()

    const menuMode = computed((): 'vertical' | 'horizontal' => {
      // 竖
      const vertical: LayoutType[] = ['classic', 'topLeft', 'cutMenu']

      if (vertical.includes(unref(layout))) {
        return 'vertical'
      } else {
        return 'horizontal'
      }
    })
    const userRole1 = async (): Promise<string[]> => {
      return new Promise((resolve) => {
        setTimeout(async () => {
          if (userStore.getLoginInfo) {
            const userId = userStore.getLoginInfo.userId
            const response = await userRole({ userId })
            if (response.data) {
              const roleKey = response.data.data
              const roleKeyArray: string[] = []
              if (Array.isArray(roleKey) && roleKey.length > 0) {
                roleKey.forEach((item) => {
                  roleKeyArray.push(item.role_id)
                })
                resolve(roleKeyArray) // 返回解析后的角色数组
              } else {
                resolve([]) // 返回空数组
              }
            } else {
              resolve([]) // 返回空数组
            }
          } else {
            resolve([]) // 返回空数组
          }
        }, 200) // 模拟 2 秒的异步操作
      })
    }

    // 在 mounted 钩子中调用异步函数并更新 result
    onMounted(async () => {
      result.value = await userRole1()
    })

    // 使用 computed 来计算路由
    const routers = computed(() => {
      if (!result.value) {
        return [] // 如果 result 为空，直接返回空数组
      }

      // 获取用户角色
      const userRoleArray = result.value
      console.log(userRoleArray, Array.isArray(userRoleArray), 'userRoleArray')

      // 判断 layout 是否为 'cutMenu'，并返回对应的路由
      const routerArray =
        unref(layout) === 'cutMenu' ? permissionStore.getMenuTabRouters : permissionStore.getRouters

      // 如果 layout 不是 'cutMenu'，加入角色判断逻辑
      routerArray.forEach((item) => {
        // 针对 GearPlacement 路由进行角色判断
        if (item.name === 'GearPlacement') {
          if (Array.isArray(userRoleArray) && userRoleArray.indexOf('yc009') === -1) {
            // item.meta.hidden = true
          }
        }
        // 如果有子路由，默认都显示
        if (item.children != null) {
          for (let i = 0; i < item.children.length; i++) {
            if (
              item.children[i].name === 'GearPlacementDemo' &&
              Array.isArray(userRoleArray) &&
              userRoleArray.indexOf('yc009') === -1
            ) {
              // item.children[i].meta.hidden = true
            } else {
              // item.children[i].meta.hidden = false
            }
          }
        }
      })
      return routerArray
    })
    // const routers = computed(() => {
    //   return unref(layout) === 'cutMenu'
    //     ? permissionStore.getMenuTabRouters
    //     : permissionStore.getRouters
    // })

    const collapse = computed(() => appStore.getCollapse)

    const uniqueOpened = computed(() => appStore.getUniqueOpened)

    const activeMenu = computed(() => {
      const { meta, path } = unref(currentRoute)
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu as string
      }
      return path
    })

    const menuSelect = (index: string) => {
      if (props.menuSelect) {
        props.menuSelect(index)
      }
      // 自定义事件
      if (isUrl(index)) {
        window.open(index)
      } else {
        push(index)
      }
    }

    const renderMenuWrap = () => {
      if (unref(layout) === 'top') {
        return renderMenu()
      } else {
        return <ElScrollbar>{renderMenu()}</ElScrollbar>
      }
    }

    const renderMenu = () => {
      return (
        <ElMenu
          defaultActive={unref(activeMenu)}
          mode={unref(menuMode)}
          collapse={
            unref(layout) === 'top' || unref(layout) === 'cutMenu' ? false : unref(collapse)
          }
          uniqueOpened={unref(layout) === 'top' ? false : unref(uniqueOpened)}
          backgroundColor="var(--left-menu-bg-color)"
          textColor="var(--left-menu-text-color)"
          activeTextColor="var(--left-menu-text-active-color)"
          popperClass={
            unref(menuMode) === 'vertical'
              ? `${prefixCls}-popper--vertical`
              : `${prefixCls}-popper--horizontal`
          }
          onSelect={menuSelect}
        >
          {{
            default: () => {
              const { renderMenuItem } = useRenderMenuItem(menuMode)
              return renderMenuItem(unref(routers))
            }
          }}
        </ElMenu>
      )
    }

    return () => (
      <div
        id={prefixCls}
        class={[
          `${prefixCls} ${prefixCls}__${unref(menuMode)}`,
          'h-[100%] overflow-hidden flex-col bg-[var(--left-menu-bg-color)]',
          {
            'w-[var(--left-menu-min-width)]': unref(collapse) && unref(layout) !== 'cutMenu',
            'w-[var(--left-menu-max-width)]': !unref(collapse) && unref(layout) !== 'cutMenu'
          }
        ]}
      >
        {renderMenuWrap()}
      </div>
    )
  }
})
</script>

<style lang="less" scoped>
@prefix-cls: ~'@{adminNamespace}-menu';

.@{prefix-cls} {
  position: relative;
  transition: width var(--transition-time-02);

  :deep(.@{elNamespace}-menu) {
    width: 100% !important;
    border-right: none;

    // 设置选中时子标题的颜色
    .is-active {
      & > .@{elNamespace}-sub-menu__title {
        color: var(--left-menu-text-active-color) !important;
      }
    }

    // 设置子菜单悬停的高亮和背景色
    .@{elNamespace}-sub-menu__title,
    .@{elNamespace}-menu-item {
      &:hover {
        color: var(--left-menu-text-active-color) !important;
        background-color: var(--left-menu-bg-color) !important;
      }
    }

    // 设置选中时的高亮背景和高亮颜色
    .@{elNamespace}-menu-item.is-active {
      color: var(--left-menu-text-active-color) !important;
      background-color: var(--left-menu-bg-active-color) !important;

      &:hover {
        background-color: var(--left-menu-bg-active-color) !important;
      }
    }

    .@{elNamespace}-menu-item.is-active {
      position: relative;
    }

    // 设置子菜单的背景颜色
    .@{elNamespace}-menu {
      .@{elNamespace}-sub-menu__title,
      .@{elNamespace}-menu-item:not(.is-active) {
        background-color: var(--left-menu-bg-light-color) !important;
      }
    }
  }

  // 折叠时的最小宽度
  :deep(.@{elNamespace}-menu--collapse) {
    width: var(--left-menu-min-width);

    & > .is-active,
    & > .is-active > .@{elNamespace}-sub-menu__title {
      position: relative;
      background-color: var(--left-menu-collapse-bg-active-color) !important;
    }
  }

  // 折叠动画的时候，就需要把文字给隐藏掉
  :deep(.horizontal-collapse-transition) {
    .@{prefix-cls}__title {
      display: none;
    }
  }

  // 水平菜单
  &__horizontal {
    height: calc(~'var(--top-tool-height)') !important;

    :deep(.@{elNamespace}-menu--horizontal) {
      height: calc(~'var(--top-tool-height)');
      border-bottom: none;
      // 重新设置底部高亮颜色
      & > .@{elNamespace}-sub-menu.is-active {
        .@{elNamespace}-sub-menu__title {
          border-bottom-color: var(--el-color-primary) !important;
        }
      }

      .@{elNamespace}-menu-item.is-active {
        position: relative;

        &::after {
          display: none !important;
        }
      }

      .@{prefix-cls}__title {
        /* stylelint-disable-next-line */
        max-height: calc(~'var(--top-tool-height) - 2px') !important;
        /* stylelint-disable-next-line */
        line-height: calc(~'var(--top-tool-height) - 2px');
      }
    }
  }
}
</style>

<style lang="less">
@prefix-cls: ~'@{adminNamespace}-menu-popper';

.@{prefix-cls}--vertical,
.@{prefix-cls}--horizontal {
  // 设置选中时子标题的颜色
  .is-active {
    & > .el-sub-menu__title {
      color: var(--left-menu-text-active-color) !important;
    }
  }

  // 设置子菜单悬停的高亮和背景色
  .el-sub-menu__title,
  .el-menu-item {
    &:hover {
      color: var(--left-menu-text-active-color) !important;
      background-color: var(--left-menu-bg-color) !important;
    }
  }

  // 设置选中时的高亮背景
  .el-menu-item.is-active {
    position: relative;
    background-color: var(--left-menu-bg-active-color) !important;

    &:hover {
      background-color: var(--left-menu-bg-active-color) !important;
    }
  }
}

@submenu-prefix-cls: ~'@{adminNamespace}-submenu-popper';

// 设置子菜单溢出时滚动样式
.@{submenu-prefix-cls}--vertical {
  max-height: 100%;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
    background-color: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgb(144 147 153 / 30%);
    border-radius: 4px;
  }
}
</style>
