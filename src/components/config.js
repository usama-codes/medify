import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jdqdpatiyxmyrwuziynw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkcWRwYXRpeXhteXJ3dXppeW53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEzNDgxOTcsImV4cCI6MjA0NjkyNDE5N30.2_EuS9_YoJbNrf_6zuF_yreCv343OSVwz4Z5he4fXZ4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
