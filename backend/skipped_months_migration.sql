alter table entries
  add column if not exists skipped_months text[] not null default '{}';

alter table fixed_costs
  add column if not exists skipped_months text[] not null default '{}';
