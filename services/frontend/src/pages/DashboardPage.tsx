import { FC } from "react"
import { useAuth } from "../app/modules/auth/core/Auth";

const DashboardPage: FC = () => {
    const {currentUser} = useAuth();
    console.log(currentUser);
    
    return (
        <div>DashboardPage</div>
    )
}

const DashboardWrapper: FC = () => {

    return (
        <>
            {/* <PageTitle breadcrumbs={[]}>
                {intl.formatMessage({ id: 'MENU.DASHBOARD' })}
            </PageTitle> */}
            <DashboardPage />
        </>
    );
};

export { DashboardWrapper };