import { Key } from "react";

export default function ProjectPage(){
    const projects = await prisma.projects.findMany({
          orderBy: {
            name: "asc",
          },
        });

    
    return <>
    {projects.map((project)=> 
    <div key={project.id}>project</div>)} 
    </>
}