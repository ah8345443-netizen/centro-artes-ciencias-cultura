insert into public.questions
(code, area, topic_code, topic_name, difficulty, prompt, option_a, option_b, option_c, option_d, correct_option, explanation)
values
('CL1-001','CL','CL1','Tipos de texto',1,'¿Cuál es el propósito principal de un texto instructivo?','Narrar hechos','Explicar pasos para realizar una tarea','Defender una opinión','Describir un personaje','B','Un texto instructivo organiza indicaciones o pasos para realizar una acción.'),
('RI1-001','RI','RI1','Conectores',1,'Elige el conector que completa mejor: Estudió durante semanas; ___, obtuvo un buen resultado.','sin embargo','por ello','aunque','mientras','B','“Por ello” expresa una consecuencia lógica.'),
('MT1-001','MT','MT1','Jerarquía de operaciones',1,'¿Cuál es el resultado de 8 + 3 × 4?','44','20','32','24','B','Primero se realiza la multiplicación: 3 × 4 = 12; después 8 + 12 = 20.'),
('MT2-001','MT','MT2','Fracciones',1,'¿Cuál fracción equivale a 0.75?','1/2','2/3','3/4','4/5','C','0.75 = 75/100 = 3/4.'),
('MT3-001','MT','MT3','Porcentajes',1,'¿Cuánto es el 20% de 350?','50','60','70','80','C','20% = 0.20 y 350 × 0.20 = 70.')
on conflict (code) do nothing;
