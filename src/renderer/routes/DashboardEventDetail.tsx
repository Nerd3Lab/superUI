import { Icon } from '@iconify/react';
import { useState } from 'react';
import styled from 'styled-components';
import ButtonStyled from '../components/utility/ButtonStyled';

interface Props extends SimpleComponent {}

const DashboardEventDetailRouteWrapper = styled.div``;

function Tab({
  label,
  count,
  isActive,
  onClick,
}: {
  label: string;
  count?: number;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className={`w-1/3 text-center font-semibold cursor-pointer ${isActive ? 'text-brand-700 border-b-2 border-brand-600' : 'text-gray-500'}`}
      onClick={onClick}
    >
      <div className="flex justify-center items-center gap-2">
        <div>{label}</div>
        {count !== undefined && (
          <div className="rounded-full border border-brand-200 bg-brand-50 px-2 py-0.5 text-xs">
            {count}
          </div>
        )}
      </div>
    </div>
  );
}

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex gap-8">
    <div className="w-1/4 text-gray-700 text-sm">{label}</div>
    <div className="w-2/4 text-gray-600 break-words">{value}</div>
  </div>
);

function DashboardEventDetailRoute(props: Props) {
  const [selectedTab, setSelectedTab] = useState('transaction');
  return (
    <DashboardEventDetailRouteWrapper className="px-3">
      {/* Header */}
      <div className="flex gap-1.5 items-center text-brand-700 mb-5 cursor-pointer">
        <Icon icon="gravity-ui:arrow-left" />
        <div className="text-sm font-semibold">Go back</div>
      </div>
      {/* Address Section */}
      <div className="flex justify-between gap-4 mb-4">
        <div className="flex gap-1 items-center">
          <div className="w-6 h-6 rounded-full border"></div>
          <div className="text-lg font-semibold text-gray-900">
            0x9008D19f58AAbD9eD0D60971565AA8510560ab41 (Name)
          </div>
        </div>
        <div className="flex gap-3">
          <button className="py-2.5 px-3.5 border border-gray-300 rounded-full bg-white cursor-pointer">
            Secondary
          </button>
          <ButtonStyled>Primary</ButtonStyled>
        </div>
      </div>
      {/* Information Section */}
      <div className="flex shadow-sm bg-white p-5 rounded-2xl border border-gray-200 my-3">
        {[
          {
            label: 'ADDRESS',
            value: '0x38f409e4A974A7A0B19F707BDCFF56dC3F6Eb0a4',
          },
          {
            label: 'CREATION TX',
            value:
              '0x326495056D8C8ae784B1Bb35c448f65817Bda7A6d0F7d4eB6Db2b06B7DD0',
          },
          { label: 'EVENTS', value: '70.00 ETH' },
        ].map((item, index) => (
          <div key={index} className="w-1/3">
            <div className="text-gray-700">{item.label}</div>
            <div className="truncate text-gray-600 text-sm font-medium">
              {item.value}
            </div>
          </div>
        ))}
      </div>
      {/* Tabs Section */}
      <div className="w-full flex mb-5">
        <Tab
          label="STORAGE"
          isActive={selectedTab === 'storage'}
          onClick={() => setSelectedTab('storage')}
        />
        <Tab
          label="TRANSACTIONS"
          count={2}
          isActive={selectedTab === 'transaction'}
          onClick={() => setSelectedTab('transaction')}
        />
        <Tab
          label="EVENTS"
          isActive={selectedTab === 'events'}
          onClick={() => setSelectedTab('events')}
        />
      </div>
      {selectedTab === 'transaction' && (
        <div>
          <InfoRow
            label="Name"
            value="0x326495056D8C8ae784B1Bb35c448f65817Bda7A6d0F7d4eB6Db2b06B7DD0"
          />
          <hr className="my-2 text-gray-200" />
          <InfoRow
            label="Country"
            value={
              'Transfer1,081.304124246360932307($2,314.96)WLDTo0x86cf36054F9F20438AFf77Ae192482965065Fc35'
            }
          />
          <hr className="my-2 text-gray-200" />
          <InfoRow
            label="Country"
            value={
              'Transfer1,081.304124246360932307($2,314.96)WLDTo0x86cf36054F9F20438AFf77Ae192482965065Fc35'
            }
          />
          <hr className="my-2 text-gray-200" />
          <div className="flex gap-8">
            <div className="w-1/4">
              <div className="text-gray-700 font-semibold mb-1">Bio</div>
              <div className="text-gray-500 text-sm mb-2">
                Write a short introduction.
              </div>
            </div>
            <div className="w-2/4">
              <textarea
                className="w-full p-2 border border-gray-300 rounded-lg text-sm text-gray-900"
                placeholder="I'm a Product Designer based in Melbourne, Australia. I specialise in UX/UI design, brand strategy, and Webflow development."
              />
              <button className="rounded-full border border-brand-300 py-2 px-3 flex gap-1 bg-white shadow-xs mt-3">
                <div className="w-5 h-5 rounded-full border-brand-700 border-2"></div>
                <div className="text-sm font-semibold text-brand-700">
                  Secondary
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardEventDetailRouteWrapper>
  );
}

export default DashboardEventDetailRoute;
