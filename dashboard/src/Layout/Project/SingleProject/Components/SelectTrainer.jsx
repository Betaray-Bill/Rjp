import { Input } from '@/components/ui/input';
import api from '@/utils/api';
import React, { useState } from 'react';
import { useQuery } from 'react-query';

function SelectTrainer() {
    const [search, setSearch] = useState('');

    const getTrainersByNameOrEmail = async (search) => {
        if (!search) return [];
        try {
            const response = await api.get(`/employee/getTrainersByNameOrEmail?search=${search}`);
            return response.data;
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    const { data: trainers, refetch } = useQuery(
        ['trainers', search],
        () => getTrainersByNameOrEmail(search),
        {
            enabled: false,
            staleTime: 1000 * 60 * 10, // 10 minutes
            cacheTime: 1000 * 60 * 30, // 30 minutes
        }
    );

    return (
        <div>
            <div className='flex items-center justify-between border border-gray-600 rounded-lg px-l-4 overflow-hidden'>
                <Input
                    type='text'
                    placeholder='Select Trainer'
                    className='border-none w-[200px]'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <div onClick={() => refetch()} className='cursor-pointer hover:bg-blue-200 p-2'>
                    <ion-icon name='search-outline' style={{ fontSize: '24px' }}></ion-icon>
                </div>
            </div>
            {trainers?.length > 0 && (
                <ul className='mt-2 border border-gray-300 rounded-lg p-2'>
                    {trainers.map((trainer) => (
                        <li key={trainer._id} className='p-1 border-b last:border-b-0'>
                            {trainer.trainerId}{trainer.generalDetails.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default SelectTrainer;