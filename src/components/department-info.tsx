import React from "react";
import { ExternalLink, Building2 } from 'lucide-react';
import { motion } from "framer-motion";

interface Department {
    Name: string;
    Courses?: string;
    HOD?: string;
    OfficialPage?: string;
    coords: { lat: number; lng: number };
    [key: string]: any;
}

const DepartmentInfo = ({ department }: { department: Department }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-lg p-6 mt-4 space-y-4"
        >
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-800">{department.Name}</h3>
                {department.OfficialPage && (
                    <a
                        href={department.OfficialPage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors duration-200"
                    >
                        <ExternalLink size={16} />
                        <span>Visit</span>
                    </a>
                )}
            </div>

            {department.HOD && (
                <div className="flex items-center gap-2 text-gray-600">
                    <Building2 size={16} />
                    <span>HOD: {department.HOD}</span>
                </div>
            )}

            {department.Courses && (
                <div className="bg-gray-50 p-3 rounded-md">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Courses Offered</h4>
                    <p className="text-sm text-gray-600">{department.Courses}</p>
                </div>
            )}

            {Object.entries(department).map(([key, value]) => {
                if (!['Name', 'coords', 'HOD', 'Courses', 'OfficialPage'].includes(key) && typeof value === 'string') {
                    return (
                        <div key={key} className="flex justify-between items-center py-2 border-t border-gray-100">
                            <span className="text-sm text-gray-600">{key}</span>
                            <span className="text-sm text-gray-800">{value}</span>
                        </div>
                    );
                }
                return null;
            })}
        </motion.div>
    );
};

export default DepartmentInfo;
