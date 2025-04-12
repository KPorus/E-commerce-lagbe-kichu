import HeroBanner from '@/Desktop/common/hero-bannner';
import AdminTable from '@/Desktop/components/admin-table';
import React from 'react';

const Dashboard = () => {
    return (
        <>
          <HeroBanner title='Dashboard'/>  
          <AdminTable/>
        </>
    );
};

export default Dashboard;