import SearchBar from '@/Layout/Search/SearchBar'
import SearchResult from '@/Layout/Search/SearchResult'
import React from 'react'
import { useParams } from 'react-router-dom'

function ProjectSearchTrainer() {
    const projectId = useParams()
    console.log(projectId.projectId)
  return (
    <div>
      {/* Project Trainer {projectId && projectId} */}

      <SearchBar />

      <SearchResult />
    </div>
  )
}

export default ProjectSearchTrainer
