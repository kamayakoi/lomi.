import { RiCheckboxCircleFill } from '@remixicon/react';
import { Card, Tracker } from '@tremor/react';

const data = [
    {
        tooltip: '23 Sep, 2023',
        status: 'Operational',
    },
    {
        tooltip: '24 Sep, 2023',
        status: 'Operational',
    },
    {
        tooltip: '25 Sep, 2023',
        status: 'Operational',
    },
    {
        tooltip: '26 Sep, 2023',
        status: 'Operational',
    },
    {
        tooltip: '27 Sep, 2023',
        status: 'Operational',
    },
    {
        tooltip: '28 Sep, 2023',
        status: 'Operational',
    },
    {
        tooltip: '29 Sep, 2023',
        status: 'Operational',
    },
    {
        tooltip: '30 Sep, 2023',
        status: 'Operational',
    },
    {
        tooltip: '1 Oct, 2023',
        status: 'Operational',
    },
    {
        tooltip: '2 Oct, 2023',
        status: 'Operational',
    },
    {
        tooltip: '3 Oct, 2023',
        status: 'Operational',
    },
    {
        tooltip: '4 Oct, 2023',
        status: 'Operational',
    },
    {
        tooltip: '5 Oct, 2023',
        status: 'Operational',
    },
    {
        tooltip: '6 Oct, 2023',
        status: 'Operational',
    },
    {
        tooltip: '7 Oct, 2023',
        status: 'Operational',
    },
    {
        tooltip: '8 Oct, 2023',
        status: 'Operational',
    },
    {
        tooltip: '9 Oct, 2023',
        status: 'Operational',
    },
    {
        tooltip: '10 Oct, 2023',
        status: 'Operational',
    },
    {
        tooltip: '11 Oct, 2023',
        status: 'Operational',
    },
    {
        tooltip: '12 Oct, 2023',
        status: 'Operational',
    },
];

const colorMapping: Record<string, string> = {
    Operational: 'emerald-500',
    Downtime: 'red-500',
    Inactive: 'gray-300',
};

const combinedData = data.map((item) => {
    return {
        ...item,
        color: colorMapping[item.status],
    };
});

export default function Example() {
    return (
        <>
            <Card>
                <div className="flex items-center space-x-2">
                    <RiCheckboxCircleFill
                        className="size-5 shrink-0 text-emerald-500"
                        aria-hidden={true}
                    />
                    <p className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                        lomi.africa
                    </p>
                </div>
                <Tracker data={combinedData} className="mt-4 hidden w-full lg:flex" />
                <Tracker
                    data={combinedData.slice(30, 90)}
                    className="mt-3 hidden w-full sm:flex lg:hidden"
                />
                <Tracker
                    data={combinedData.slice(60, 90)}
                    className="mt-3 flex w-full sm:hidden"
                />
                <div className="mt-3 flex items-center justify-between text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                    <span className="hidden lg:block">Past 90 days</span>
                    <span className="hidden sm:block lg:hidden">Past 60 days</span>
                    <span className="sm:hidden">Past 30 days</span>
                    <span>Today</span>
                </div>
            </Card >
        </>
    );
}