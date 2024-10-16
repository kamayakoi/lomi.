import React from 'react';

interface SegmentedControlProps {
    value: string;
    onValueChange: (value: string) => void;
    className?: string;
    children: React.ReactNode;
}

interface SegmentedControlItemProps {
    children: React.ReactNode;
    value: string;
    className?: string;
    isSelected?: boolean;
    onClick?: () => void;
}

const SegmentedControl: React.FC<SegmentedControlProps> & {
    Item: React.FC<SegmentedControlItemProps>;
} = ({ value, onValueChange, className, children }) => {
    return (
        <div className={`flex rounded-md bg-muted/30 p-1 ${className ?? ''}`}>
            {React.Children.map(children, (child) => {
                if (!React.isValidElement<SegmentedControlItemProps>(child)) {
                    return null;
                }
                const childValue = child.props.value;
                return React.cloneElement(child, {
                    isSelected: childValue === value,
                    onClick: () => onValueChange(childValue),
                });
            })}
        </div>
    );
};

const SegmentedControlItem: React.FC<SegmentedControlItemProps> = ({
    children,
    className,
    isSelected,
    onClick
}) => {
    return (
        <div
            className={`
        flex-1 py-2 px-4 text-center cursor-pointer transition-all duration-200
        rounded-md
        focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50
        ${isSelected
                    ? 'bg-primary/10 dark:bg-primary/20 text-primary shadow-sm'
                    : 'text-muted-foreground hover:bg-muted/20 dark:hover:bg-muted/30'
                }
        ${className ?? ''}
      `}
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    onClick?.();
                }
            }}
        >
            {children}
        </div>
    );
};

SegmentedControl.Item = SegmentedControlItem;

export { SegmentedControl };