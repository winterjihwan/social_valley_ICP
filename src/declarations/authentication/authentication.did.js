export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'query_secretProvided' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'status_initialize' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'update_secretProvided' : IDL.Func([IDL.Text, IDL.Bool], [IDL.Bool], []),
  });
};
export const init = ({ IDL }) => { return []; };
