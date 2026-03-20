// src/Pages/Admin/AdminApp.jsx
import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout      from './AdminLayout';
import InstitutionAdmin from './InstitutionAdmin';
import EmployeeAdmin    from './EmployeeAdmin';
import ProductAdmin     from './ProductAdmin';

const AdminApp = () => {
    const [activeInstitution, setActiveInstitution] = useState(null);

    return (
        <AdminLayout
            activeInstitution={activeInstitution}
            onInstitutionChange={setActiveInstitution}
        >
            <Routes>
                <Route index          element={<InstitutionAdmin activeInstitution={activeInstitution} />} />
                <Route path="employees" element={<EmployeeAdmin  activeInstitution={activeInstitution} />} />
                <Route path="products"  element={<ProductAdmin   activeInstitution={activeInstitution} />} />
                <Route path="*"         element={<Navigate to="/admin" replace />} />
            </Routes>
        </AdminLayout>
    );
};

export default AdminApp;
