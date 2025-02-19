import { Button } from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import api from '@/utils/api';
import React, {useState} from 'react';
import {useQuery, useQueryClient} from 'react-query';
import { useParams } from 'react-router-dom';
let i=0;
function SelectTrainer() {
    const [search,
        setSearch] = useState('');
    const queryClient = useQueryClient();
    const projectId = useParams()
    
    const getTrainersByNameOrEmail = async(search) => {
        if (!search) 
            return [];
        try {
            const response = await api.get(`/employee/getTrainersByNameOrEmail?search=${search}`);
            console.log(i);
            i=i+1;
            return response.data;
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    const {data: trainers, refetch} = useQuery([
        'trainers', search
    ], () => getTrainersByNameOrEmail(search), {
        enabled: false,
        staleTime: 1000 * 60 * 10, // 10 minutes
        cacheTime: 1000 * 60 * 30, // 30 minutes
    });

    const addTrainerToProject = async(trainer) => {
        try {
            // axios.defaults.withCredentials = true;
            let a = []
            a.push(trainer);
            console.log(a)
            const trainerSubmit = await api.put(`/project/add-trainers/${projectId.projectId}`, {trainers:a})
            const response = await trainerSubmit.data;
            console.log(response)
            // setSelectedTrainers([])
            queryClient.invalidateQueries(['ViewProject', projectId.projectId]);
            // refetch()
        } catch (error) {
            console.log(error);
        }
        // setSelectedTrainers([])
    }

    return (
        <div className='relative mr-12'>
            <div className='flex items-center justify-between border border-gray-500'>
                <Input
                    type='text'
                    placeholder='Select Trainer'
                    className='w-[200px] border-none'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}/>
                <div className='flex items-center'>
                    <div onClick={() => refetch()} className='cursor-pointer hover:bg-blue-200 p-2'>
                        <ion-icon
                            name='search-outline'
                            style={{
                            fontSize: '24px'
                        }}></ion-icon>
                    </div>
                    {search.length > 0 && <div onClick={() => {
                        setSearch('');
                        
                    }}><ion-icon name="close-outline" style={{color:'red', fontSize:'24px'}}></ion-icon></div>
}
                </div>
            </div>
            <div className='absolute bg-white w-full z-10 drop-shadow-lg border-gray-500'>
                {trainers
                    ?.length > 0 && (
                        <ul className=' border border-gray-300 p-2'>
                            {trainers.map((trainer) => (
                                <li key={trainer._id} className='p-1 border-b last:border-b-0 flex justify-between items-center'>
                                    <span>
                                        {trainer.generalDetails.name}
                                    </span>
                                    <Button 
                                        className="bg-blue-800  rounded-none"
                                        onClick={() => addTrainerToProject(trainer._id)}
                                    >
                                    Add</Button>
                                </li>
                            ))}
                        </ul>
                    )}
            </div>
        </div>
    );
}

export default SelectTrainer;