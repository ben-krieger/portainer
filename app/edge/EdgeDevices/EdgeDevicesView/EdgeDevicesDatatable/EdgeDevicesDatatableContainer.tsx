import { useState } from 'react';

import {
  TableSettingsProvider,
  useTableSettings,
} from '@/portainer/components/datatables/components/useTableSettings';
import { useEnvironmentList } from '@/portainer/environments/queries/useEnvironmentList';
import { Environment } from '@/portainer/environments/types';
import { useSearchBarState } from '@/portainer/components/datatables/components/SearchBar';
import { useDebounce } from '@/portainer/hooks/useDebounce';

import {
  EdgeDevicesDatatable,
  EdgeDevicesTableProps,
} from './EdgeDevicesDatatable';
import { EdgeDeviceTableSettings, Pagination } from './types';

export function EdgeDevicesDatatableContainer({
  ...props
}: Omit<
  EdgeDevicesTableProps,
  | 'dataset'
  | 'pagination'
  | 'onChangePagination'
  | 'totalCount'
  | 'search'
  | 'onChangeSearch'
>) {
  const defaultSettings = {
    autoRefreshRate: 0,
    hiddenQuickActions: [],
    hiddenColumns: [],
    pageSize: 10,
    sortBy: { id: 'state', desc: false },
  };

  const storageKey = 'edgeDevices';

  return (
    <TableSettingsProvider defaults={defaultSettings} storageKey={storageKey}>
      <Loader storageKey={storageKey}>
        {({
          environments,
          pagination,
          totalCount,
          setPagination,
          search,
          setSearch,
        }) => (
          <EdgeDevicesDatatable
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...props}
            storageKey={storageKey}
            dataset={environments}
            pagination={pagination}
            onChangePagination={setPagination}
            totalCount={totalCount}
            search={search}
            onChangeSearch={setSearch}
          />
        )}
      </Loader>
    </TableSettingsProvider>
  );
}

interface LoaderProps {
  storageKey: string;
  children: (options: {
    environments: Environment[];
    totalCount: number;
    pagination: Pagination;
    setPagination(value: Partial<Pagination>): void;
    search: string;
    setSearch: (value: string) => void;
  }) => React.ReactNode;
}

function Loader({ children, storageKey }: LoaderProps) {
  const { settings } = useTableSettings<EdgeDeviceTableSettings>();
  const [pagination, setPagination] = useState({
    pageLimit: settings.pageSize,
    page: 1,
  });

  const [search, setSearch] = useSearchBarState(storageKey);
  const debouncedSearchValue = useDebounce(search);

  const { environments, isLoading, totalCount } = useEnvironmentList(
    {
      edgeDeviceFilter: 'trusted',
      search: debouncedSearchValue,
      ...pagination,
    },
    settings.autoRefreshRate * 1000
  );

  if (isLoading) {
    return null;
  }

  return (
    <>
      {children({
        environments,
        totalCount,
        pagination,
        setPagination: handleSetPagination,
        search,
        setSearch,
      })}
    </>
  );

  function handleSetPagination(value: Partial<Pagination>) {
    setPagination((prev) => ({ ...prev, ...value }));
  }
}
