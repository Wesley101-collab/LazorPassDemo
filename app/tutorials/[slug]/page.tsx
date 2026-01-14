import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export async function generateStaticParams() {
    const tutorialsDir = path.join(process.cwd(), 'tutorials');
    if (!fs.existsSync(tutorialsDir)) return [];

    const files = fs.readdirSync(tutorialsDir);
    return files
        .filter(file => file.endsWith('.md'))
        .map(file => ({
            slug: file.replace('.md', ''),
        }));
}

export default async function TutorialPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const filePath = path.join(process.cwd(), 'tutorials', `${slug}.md`);

    if (!fs.existsSync(filePath)) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Tutorial Not Found</h1>
                    <Link href="/" className="text-blue-500 hover:underline mt-4 block">Return Home</Link>
                </div>
            </div>
        );
    }

    const content = fs.readFileSync(filePath, 'utf-8');

    return (
        <div className="min-h-screen bg-black text-zinc-300 selection:bg-blue-500/30">
            <header className="border-b border-white/10 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-3xl mx-auto px-6 h-16 flex items-center">
                    <Link href="/" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                        Back to Demo
                    </Link>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-6 py-12">
                <article className="space-y-6">
                    {content.split('\n').map((line, index) => {
                        // Simple Markdown Parsing
                        if (line.startsWith('# ')) {
                            return <h1 key={index} className="text-3xl md:text-4xl font-bold text-white mb-8 mt-2">{line.replace('# ', '')}</h1>;
                        }
                        if (line.startsWith('## ')) {
                            return <h2 key={index} className="text-xl md:text-2xl font-semibold text-white mt-10 mb-4">{line.replace('## ', '')}</h2>;
                        }
                        if (line.startsWith('### ')) {
                            return <h3 key={index} className="text-lg font-medium text-white mt-8 mb-3">{line.replace('### ', '')}</h3>;
                        }
                        if (line.startsWith('```')) {
                            // Very basic code block handling (just hiding markers for now, ideally needs state for blocks)
                            // For a simple parser, we'll just return null for markers and handle code lines differently if needed.
                            // Improvment: Just render it as a distinct block styled.
                            return <div key={index} className="sr-only">Code Block Marker</div>;
                        }
                        // Detect code lines (indented or part of block - simplistic approach: render monospaced if it looks like code)
                        if (line.trim().startsWith('const ') || line.trim().startsWith('import ') || line.trim().startsWith('function ') || line.includes(';')) {
                            return (
                                <div key={index} className="bg-zinc-900 border border-white/5 rounded-lg px-4 py-3 font-mono text-sm text-blue-300 overflow-x-auto my-2">
                                    {line}
                                </div>
                            )
                        }
                        if (line.startsWith('- ')) {
                            return <li key={index} className="ml-4 list-disc text-zinc-400 pl-2">{line.replace('- ', '')}</li>;
                        }
                        if (line.trim() === '') {
                            return <div key={index} className="h-4"></div>;
                        }
                        return <p key={index} className="leading-relaxed text-zinc-300">{line}</p>;
                    })}
                </article>
            </main>
        </div>
    );
}
