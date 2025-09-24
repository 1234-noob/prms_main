import React from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { usePageData } from "../core/PageData";

const PageMeta = () => {

    const { pageTitle, pageDescription, pageBreadcrumbs } = usePageData()

    return (
        < Helmet >
            <title>PRMS-{pageTitle}</title>
            <meta name="description" content={pageDescription} />
        </Helmet >
    );

}
export const AppWrapper = ({ children }: { children: React.ReactNode }) => (
    <HelmetProvider>{children}</HelmetProvider>
);

export default PageMeta;
