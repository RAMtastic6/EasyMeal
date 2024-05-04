import React from 'react';

const SkeletonTable = () => {
    // Generate multiple skeleton rows
    const skeletonRows = Array.from({ length: 5 }, (_, index) => (
        <tr key={index} className="animate-pulse">
            <td className="px-2 py-5 whitespace-nowrap bg-gray-200"></td>
            <td className="px-2 py-5 whitespace-nowrap bg-gray-200"></td>
            <td className="px-2 py-5 whitespace-nowrap bg-gray-200"></td>
            <td className="px-2 py-5 whitespace-nowrap bg-gray-200"></td>
        </tr>
    ));

    return (
        <table className="min-w-full divide-y divide-gray-200 table-auto">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                    <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Indirizzo</th>
                    <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Città</th>
                    <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cucina</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {skeletonRows}
            </tbody>
        </table>
    );
};

export default SkeletonTable;