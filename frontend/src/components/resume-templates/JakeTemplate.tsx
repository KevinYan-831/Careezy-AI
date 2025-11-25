import React from 'react';

interface ResumeData {
    personalInfo: {
        fullName: string;
        email: string;
        phone: string;
        linkedin?: string;
        github?: string;
        website?: string;
    };
    education: Array<{
        school: string;
        degree: string;
        location: string;
        date: string;
    }>;
    experience: Array<{
        company: string;
        title: string;
        location: string;
        date: string;
        description: string[];
    }>;
    projects: Array<{
        name: string;
        technologies: string;
        date: string;
        description: string[];
    }>;
    skills: {
        languages: string;
        frameworks: string;
        tools: string;
        libraries?: string;
    };
}

interface JakeTemplateProps {
    data: ResumeData;
}

export const JakeTemplate: React.FC<JakeTemplateProps> = ({ data }) => {
    return (
        <div className="bg-white text-black font-serif p-8 max-w-[21cm] mx-auto min-h-[29.7cm] text-[11pt] leading-relaxed">
            {/* Header */}
            <div className="text-center mb-4">
                <h1 className="text-3xl font-bold uppercase tracking-wide mb-1">{data.personalInfo.fullName}</h1>
                <div className="text-sm flex justify-center gap-2 flex-wrap">
                    <span>{data.personalInfo.phone}</span>
                    <span>|</span>
                    <a href={`mailto:${data.personalInfo.email}`} className="underline">{data.personalInfo.email}</a>
                    {data.personalInfo.linkedin && (
                        <>
                            <span>|</span>
                            <a href={data.personalInfo.linkedin} className="underline">LinkedIn</a>
                        </>
                    )}
                    {data.personalInfo.github && (
                        <>
                            <span>|</span>
                            <a href={data.personalInfo.github} className="underline">GitHub</a>
                        </>
                    )}
                    {data.personalInfo.website && (
                        <>
                            <span>|</span>
                            <a href={data.personalInfo.website} className="underline">Portfolio</a>
                        </>
                    )}
                </div>
            </div>

            {/* Education */}
            <section className="mb-4">
                <h2 className="text-lg font-bold uppercase border-b border-black mb-2">Education</h2>
                <div className="space-y-2">
                    {data.education.map((edu, index) => (
                        <div key={index}>
                            <div className="flex justify-between font-bold">
                                <span>{edu.school}</span>
                                <span>{edu.location}</span>
                            </div>
                            <div className="flex justify-between italic text-sm">
                                <span>{edu.degree}</span>
                                <span>{edu.date}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Experience */}
            <section className="mb-4">
                <h2 className="text-lg font-bold uppercase border-b border-black mb-2">Experience</h2>
                <div className="space-y-4">
                    {data.experience.map((exp, index) => (
                        <div key={index}>
                            <div className="flex justify-between font-bold">
                                <span>{exp.title}</span>
                                <span>{exp.date}</span>
                            </div>
                            <div className="flex justify-between italic text-sm mb-1">
                                <span>{exp.company}</span>
                                <span>{exp.location}</span>
                            </div>
                            <ul className="list-disc list-outside ml-4 text-sm space-y-1">
                                {exp.description.map((desc, i) => (
                                    <li key={i}>{desc}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            {/* Projects */}
            <section className="mb-4">
                <h2 className="text-lg font-bold uppercase border-b border-black mb-2">Projects</h2>
                <div className="space-y-3">
                    {data.projects.map((project, index) => (
                        <div key={index}>
                            <div className="flex justify-between items-baseline mb-1">
                                <div>
                                    <span className="font-bold">{project.name}</span>
                                    <span className="italic text-sm ml-2">| {project.technologies}</span>
                                </div>
                                <span className="text-sm italic">{project.date}</span>
                            </div>
                            <ul className="list-disc list-outside ml-4 text-sm space-y-1">
                                {project.description.map((desc, i) => (
                                    <li key={i}>{desc}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            {/* Technical Skills */}
            <section>
                <h2 className="text-lg font-bold uppercase border-b border-black mb-2">Technical Skills</h2>
                <div className="text-sm space-y-1">
                    <div><span className="font-bold">Languages:</span> {data.skills.languages}</div>
                    <div><span className="font-bold">Frameworks:</span> {data.skills.frameworks}</div>
                    <div><span className="font-bold">Developer Tools:</span> {data.skills.tools}</div>
                    {data.skills.libraries && <div><span className="font-bold">Libraries:</span> {data.skills.libraries}</div>}
                </div>
            </section>
        </div>
    );
};
