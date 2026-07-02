import classNames from 'classnames'

type GetNavLinkClassNameParams = {
  isActive: boolean
}

type NavLinkClasses = {
  base: string
  active: string
}

export const getNavLinkClassName =
  ({ base, active }: NavLinkClasses) =>
  ({ isActive }: GetNavLinkClassNameParams) =>
    classNames(base, {
      [active]: isActive,
    })
