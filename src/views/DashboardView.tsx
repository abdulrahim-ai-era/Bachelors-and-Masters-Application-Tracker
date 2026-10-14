import React, { useState } from 'react';
import { Dashboard } from '../components/dashboard/Dashboard';
import { SchoolDetailModal } from '../components/schools/SchoolDetailModal';
import { SchoolFormModal } from '../components/schools/SchoolFormModal';
import { School } from '../types';

export const DashboardView: React.FC = () => {
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);

  const handleViewSchool = (school: School) => {
    setSelectedSchool(school);
    setIsDetailOpen(true);
  };

  const handleEditSchool = (school: School) => {
    setEditingSchool(school);
    setIsFormOpen(true);
  };

  const handleAddSchool = () => {
    setEditingSchool(null);
    setIsFormOpen(true);
  };

  return (
    <>
      <Dashboard
        onAddSchool={handleAddSchool}
        onEditSchool={handleEditSchool}
        onViewSchool={handleViewSchool}
      />

      {/* School Detail Modal */}
      <SchoolDetailModal
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedSchool(null);
        }}
        school={selectedSchool}
        onEdit={handleEditSchool}
      />

      {/* Add / Edit School Modal */}
      <SchoolFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingSchool(null);
        }}
        editSchoolId={editingSchool?.id ?? null}
        initialData={
          editingSchool
            ? {
                name: editingSchool.name,
                program: editingSchool.program,
                degreeType: editingSchool.degreeType,
                country: editingSchool.country,
                countryCode: editingSchool.countryCode,
                deadline: editingSchool.deadline,
                status: editingSchool.status,
                applicationFee: editingSchool.applicationFee,
                portalUrl: editingSchool.portalUrl,
                notes: editingSchool.notes,
                category: editingSchool.category,
              }
            : undefined
        }
      />
    </>
  );
};

export default DashboardView;
