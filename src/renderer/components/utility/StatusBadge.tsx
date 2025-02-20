import { Icon } from '@iconify/react';
interface StatusBadgeProps {
  status?:
    | 'active'
    | 'inactive'
    | 'transfer'
    | 'Transfer'
    | 'ContractCall'
    | 'ContractCreated'
    | 'Unknown';
  noIcon?: boolean;
}
export const StatusBadge = ({ status, noIcon }: StatusBadgeProps) => {
  if (status === 'active') {
    return (
      <div className="flex gap-2 rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 font-medium items-center">
        {!noIcon && (
          <Icon
            icon="icon-park-outline:dot"
            className="text-xs text-blue-500"
          />
        )}
        <div className="text-xs min-w-[3rem] text-center text-blue-700">
          Active
        </div>
      </div>
    );
  }

  if (status === 'Transfer') {
    return (
      <div className="flex gap-2 rounded-full border border-[#B9E6FE] bg-[#F0F9FF] px-2 py-0.5 font-medium items-center">
        {!noIcon && (
          <Icon
            icon="icon-park-outline:switch"
            className="text-xs text-[#0BA5EC]"
          />
        )}
        <div className="text-xs min-w-[3rem] text-center text-[#026AA2]">
          VALUE TRANSFER
        </div>
      </div>
    );
  }

  if (status === 'inactive') {
    return (
      <div className="flex gap-2 rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 font-medium items-center">
        {!noIcon && (
          <Icon
            icon="icon-park-outline:dot"
            className="text-xs text-gray-500"
          />
        )}
        <div className="text-xs min-w-[3rem] text-center text-gray-700">
          Inactive
        </div>
      </div>
    );
  }

  if (status === 'ContractCall') {
    return (
      <div className="flex gap-2 rounded-full border border-[#D1FAE5] bg-[#F0FFF4] px-2 py-0.5 font-medium items-center">
        {!noIcon && (
          <Icon
            icon="icon-park-outline:switch"
            className="text-xs text-[#10B981]"
          />
        )}
        <div className="text-xs min-w-[3rem] text-center text-[#065F46]">
          Contract Call
        </div>
      </div>
    );
  }

  if (status === 'ContractCreated') {
    return (
      <div className="flex gap-2 rounded-full border border-[#FEF3C7] bg-[#FFFBEB] px-2 py-0.5 font-medium items-center">
        {!noIcon && (
          <Icon
            icon="icon-park-outline:switch"
            className="text-xs text-[#F59E0B]"
          />
        )}
        <div className="text-xs min-w-[3rem] text-center text-[#78350F]">
          Contract Created
        </div>
      </div>
    );
  }

  if (status === 'Unknown') {
    return (
      <div className="flex gap-2 rounded-full border border-[#FED7D7] bg-[#FEF2F2] px-2 py-0.5 font-medium items-center">
        {!noIcon && (
          <Icon
            icon="icon-park-outline:switch"
            className="text-xs text-[#EF4444]"
          />
        )}
        <div className="text-xs min-w-[3rem] text-center text-[#991B1B]">
          Unknown
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2 rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 font-medium items-center">
      {!noIcon && (
        <Icon icon="icon-park-outline:dot" className="text-xs text-gray-500" />
      )}
      <div className="text-xs min-w-[3rem] text-center text-gray-700">
        {status}
      </div>
    </div>
  );
};
