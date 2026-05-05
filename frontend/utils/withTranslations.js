import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export const getStaticPropsWithTranslations = (namespaces = ['common']) => {
  return async ({ locale }) => {
    return {
      props: {
        ...(await serverSideTranslations(locale, namespaces)),
      },
    }
  }
}

export const getServerSidePropsWithTranslations = (namespaces = ['common']) => {
  return async ({ locale }) => {
    return {
      props: {
        ...(await serverSideTranslations(locale, namespaces)),
      },
    }
  }
}