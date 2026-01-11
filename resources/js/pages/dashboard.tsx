import DashboardCard from '@/components/DashboardCard';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { GraduationCap ,LibraryBig,Blend} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];
export default function Dashboard({ totalStudent, totalBatchs ,totalCourses}: any) {


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className='flex'>
                <DashboardCard title='Total Students' value={totalStudent} icon={<GraduationCap className="h-4 w-4" />}></DashboardCard>
                <DashboardCard title='Total Courses' value={totalCourses} icon={<Blend className="h-4 w-4" />}></DashboardCard>
                <DashboardCard title='Total Batchs' value={totalBatchs} icon={<LibraryBig className="h-4 w-4" />}></DashboardCard>
            </div>

        </AppLayout>
    );
}
