// dbconfig.js or any other file where you initialize Supabase
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = 'https://jdqdpatiyxmyrwuziynw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkcWRwYXRpeXhteXJ3dXppeW53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEzNDgxOTcsImV4cCI6MjA0NjkyNDE5N30.2_EuS9_YoJbNrf_6zuF_yreCv343OSVwz4Z5he4fXZ4';

// Initialize the Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);


// Export the functions and supabase client
module.exports = {supabase,supabaseUrl};