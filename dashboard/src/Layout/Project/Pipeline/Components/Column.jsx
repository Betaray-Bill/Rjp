import CardProject from '@/Layout/Project/Pipeline/Components/CardProject'
import {stages} from '@/utils/constants'
import React, {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"

function Column({index, stage, projects}) {
    const [type, setType] = useState("All");
    const [filteredProjects, setFilteredProjects] = useState(projects);

    useEffect(() => {
        if (stage === stages.OPEN__WON_LOST) {
            if (type === "All") {
                setFilteredProjects(projects);
            } else if (type === "Lost") {
                setFilteredProjects(projects.filter(project => project.isLost === true));
            } else if (type === "Won") {
                setFilteredProjects(projects.filter(project => project.isLost === false));
            }
        } else {
            setFilteredProjects(projects); // Default for stages other than OPEN__WON_LOST
        }
    }, [type, projects, stage]); // Ensure projects and stage changes are accounted for

    return (
        <div>
            <div
                className='w-[350px] relative h-max bg-blue-100 border-t-4 border-blue-900 rounded-b-md  p-4 flex-shrink-0'>
                <p className='text-lg font-semibold mb-2'>{stage}</p>
                {stage === stages.OPEN__WON_LOST && (
                    <Select onValueChange={(e) => setType(e)} value={type}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Lost">Lost</SelectItem>
                            <SelectItem value="Won">Won</SelectItem>
                            <SelectItem value="All">All</SelectItem>
                        </SelectContent>
                    </Select>
                )}
            </div>

            {/* Project Card */}
            {filteredProjects && filteredProjects
                ?.map((project) => (
                    <Link to={`/home/projects/view/${project._id}`} key={project._id}>
                        <CardProject projects={project} stage={stage} />
                    </Link>
                ))}
        </div>
    );
}

export default Column;

