import RenderAny from '@/components/RenderAny';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Eye } from 'lucide-react';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Students Profile',
        href: dashboard().url,
    },
];
interface PageProps {
    [key: string]: unknown;
}
export default function Index(studentData: PageProps) {

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Student Profile" />
            <div className="p-6 bg-white rounded shadow">
                <Button
                className='m-4'
                    variant="outline"
                    onClick={() => router.get(`/student/profile/${studentData.id}`)}
                >
                  Edit Profile 
                </Button>
                <RenderAny data={studentData as unknown as any} />
            </div>
        </AppLayout>
    );
}
