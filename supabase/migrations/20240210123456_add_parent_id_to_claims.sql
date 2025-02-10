
alter table debate_claims
add column parent_id uuid references debate_claims(id);
