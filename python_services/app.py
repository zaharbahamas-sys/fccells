from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import io
import json
from fpdf import FPDF
import graphviz
import tempfile

app = Flask(__name__)
CORS(app)

GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')

def get_gemini_model():
    if not GEMINI_API_KEY:
        return None
    try:
        import google.generativeai as genai
        genai.configure(api_key=GEMINI_API_KEY)  # type: ignore
        return genai.GenerativeModel('gemini-2.0-flash')  # type: ignore
    except Exception:
        return None

@app.route('/api/python/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'gemini_configured': GEMINI_API_KEY is not None
    })

PROMPT_TEMPLATES = {
    'email': """Act as a Project Manager. Write a persuasive email to the CTO proposing to replace the diesel generator at this site based on this data:
{context_data}

Focus on:
1. Financial savings and ROI
2. Theft/fuel loss prevention  
3. Environmental benefits
4. Operational reliability improvements

{lang_instruction}
Keep the email professional and concise (max 300 words).""",

    'action_plan': """Create a detailed numbered Action Plan to modernize this telecom site with fuel cell technology.
{context_data}

Include:
1. Site assessment steps
2. Equipment procurement timeline
3. Installation phases
4. Testing and commissioning
5. Staff training requirements
6. Handover checklist

{lang_instruction}
Be specific with timelines and responsibilities.""",

    'analysis': """Act as a Senior Power Systems Engineer. Analyze this site configuration:
{context_data}

Provide:
1. Generator health assessment (explain 'Wet Stacking' risks if Load Factor < 30%)
2. Fuel cell sizing validation
3. Battery buffer recommendations
4. Financial comparison analysis
5. Risk assessment and mitigation

CRITICAL INSTRUCTION: All technical information, claims, and recommendations MUST be backed by specific references to engineering standards (e.g., ISO 8528, IEC 62282), manufacturer specifications, or peer-reviewed energy research. If a specific standard is used, cite it clearly. Do not provide information without a source or reference.

{lang_instruction}
Keep response technical but actionable."""
}

CONTEXT_TEMPLATE = """
Site Parameters:
- Load: {load} kW
- Autonomy Required: {autonomy} hours
- System Voltage: {voltage} VDC
- Temperature: {temperature}C
- Altitude: {altitude} meters

Current Generator (if applicable):
- Rated Power: {dgRated} kVA
- Load Factor: {loadFactor}%
- Age: {dgAge} years
- Diesel Cost (Daily): ${dgDailyCost}

Proposed Fuel Cell: {fuelCellModel}
Fuel Cell Daily Cost: ${fcDailyCost}
Daily Savings: ${dailySavings}
"""

def build_context_data(data):
    """Safely build context data using template formatting."""
    return CONTEXT_TEMPLATE.format(
        load=data.get('load', 'N/A'),
        autonomy=data.get('autonomy', 'N/A'),
        voltage=data.get('voltage', 'N/A'),
        temperature=data.get('temperature', 'N/A'),
        altitude=data.get('altitude', 'N/A'),
        dgRated=data.get('dgRated', 'N/A'),
        loadFactor=data.get('loadFactor', 'N/A'),
        dgAge=data.get('dgAge', 'N/A'),
        dgDailyCost=data.get('dgDailyCost', 'N/A'),
        fuelCellModel=data.get('fuelCellModel', 'Not selected'),
        fcDailyCost=data.get('fcDailyCost', 'N/A'),
        dailySavings=data.get('dailySavings', 'N/A')
    )

def build_prompt(task_type, context_data, lang_instruction):
    """Build AI prompt using predefined templates."""
    template = PROMPT_TEMPLATES.get(task_type, PROMPT_TEMPLATES['analysis'])
    return template.format(
        context_data=context_data,
        lang_instruction=lang_instruction
    )

@app.route('/api/python/analyze', methods=['POST'])
def analyze_system():
    data = request.json
    model = get_gemini_model()
    
    task_type = data.get('taskType', 'analysis')
    language = data.get('language', 'english')
    
    if not model:
        return jsonify({
            'success': False,
            'error': 'Gemini API key not configured',
            'recommendation': get_fallback_recommendation(data)
        })
    
    try:
        lang_instruction = "Write in Arabic." if language == 'arabic' else "Write in English."
        context_data = build_context_data(data)
        prompt = build_prompt(task_type, context_data, lang_instruction)

        response = model.generate_content(prompt)
        
        return jsonify({
            'success': True,
            'analysis': response.text,
            'model': 'gemini-2.0-flash',
            'taskType': task_type,
            'language': language
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'recommendation': get_fallback_recommendation(data)
        })

def get_fallback_recommendation(data):
    load = data.get('load', 0)
    autonomy = data.get('autonomy', 8)
    
    if load < 5:
        return "For small loads under 5kW, consider portable fuel cell systems like SFC EFOY Pro series. Battery backup with 24V configuration recommended."
    elif load < 20:
        return "Mid-range loads (5-20kW) suit modular fuel cell stacks. Consider Plug Power GenDrive or Ballard FCgen series. 48V system voltage recommended."
    else:
        return "For loads over 20kW, industrial fuel cell systems like Bloom Energy or Hydrogenics are optimal. Consider 380V DC bus architecture."

@app.route('/api/python/generate-pdf', methods=['POST'])
def generate_pdf():
    data = request.json
    
    try:
        pdf = FPDF()
        pdf.add_page()
        
        pdf.set_font('Helvetica', 'B', 20)
        pdf.cell(0, 15, 'FCPMS Sizing Report', new_x='LMARGIN', new_y='NEXT', align='C')
        
        pdf.set_font('Helvetica', '', 10)
        pdf.cell(0, 8, f"Generated: {data.get('date', 'N/A')}", new_x='LMARGIN', new_y='NEXT', align='C')
        pdf.ln(10)
        
        pdf.set_font('Helvetica', 'B', 14)
        pdf.cell(0, 10, 'Site Parameters', new_x='LMARGIN', new_y='NEXT')
        pdf.set_font('Helvetica', '', 11)
        
        site_params = [
            ('Load Requirement', f"{data.get('load', 'N/A')} kW"),
            ('Autonomy', f"{data.get('autonomy', 'N/A')} hours"),
            ('System Voltage', f"{data.get('voltage', 'N/A')} VDC"),
            ('Ambient Temperature', f"{data.get('temperature', 'N/A')} C"),
            ('Altitude', f"{data.get('altitude', 'N/A')} m"),
        ]
        
        for label, value in site_params:
            pdf.cell(80, 8, label + ':', new_x='RIGHT')
            pdf.cell(0, 8, value, new_x='LMARGIN', new_y='NEXT')
        
        pdf.ln(5)
        
        if data.get('fuelCell'):
            pdf.set_font('Helvetica', 'B', 14)
            pdf.cell(0, 10, 'Selected Fuel Cell', new_x='LMARGIN', new_y='NEXT')
            pdf.set_font('Helvetica', '', 11)
            
            fc = data.get('fuelCell', {})
            fc_params = [
                ('Model', fc.get('model', 'N/A')),
                ('Manufacturer', fc.get('manufacturer', 'N/A')),
                ('Rated Power', f"{fc.get('ratedPower', 'N/A')} kW"),
                ('Efficiency', f"{fc.get('efficiency', 'N/A')}%"),
            ]
            
            for label, value in fc_params:
                pdf.cell(80, 8, label + ':', new_x='RIGHT')
                pdf.cell(0, 8, str(value), new_x='LMARGIN', new_y='NEXT')
        
        pdf.ln(5)
        
        if data.get('results'):
            pdf.set_font('Helvetica', 'B', 14)
            pdf.cell(0, 10, 'Calculation Results', new_x='LMARGIN', new_y='NEXT')
            pdf.set_font('Helvetica', '', 11)
            
            results = data.get('results', {})
            result_params = [
                ('FC Stack Required', f"{results.get('fcStackRequired', 'N/A')} units"),
                ('Battery Capacity', f"{results.get('batteryCapacity', 'N/A')} Ah"),
                ('Battery Strings', f"{results.get('batteryStrings', 'N/A')}"),
                ('H2 Cylinders Required', f"{results.get('h2Cylinders', 'N/A')}"),
                ('Cable Size', f"{results.get('cableSize', 'N/A')} mm2"),
            ]
            
            for label, value in result_params:
                pdf.cell(80, 8, label + ':', new_x='RIGHT')
                pdf.cell(0, 8, str(value), new_x='LMARGIN', new_y='NEXT')
        
        pdf.ln(5)
        
        if data.get('financial'):
            pdf.set_font('Helvetica', 'B', 14)
            pdf.cell(0, 10, 'Financial Comparison (10-Year TCO)', new_x='LMARGIN', new_y='NEXT')
            pdf.set_font('Helvetica', '', 11)
            
            fin = data.get('financial', {})
            fin_params = [
                ('Diesel Generator TCO', f"${fin.get('dgTCO', 'N/A'):,.0f}" if isinstance(fin.get('dgTCO'), (int, float)) else 'N/A'),
                ('Fuel Cell TCO', f"${fin.get('fcTCO', 'N/A'):,.0f}" if isinstance(fin.get('fcTCO'), (int, float)) else 'N/A'),
                ('Annual Savings', f"${fin.get('annualSavings', 'N/A'):,.0f}" if isinstance(fin.get('annualSavings'), (int, float)) else 'N/A'),
                ('Payback Period', f"{fin.get('paybackYears', 'N/A')} years"),
            ]
            
            for label, value in fin_params:
                pdf.cell(80, 8, label + ':', new_x='RIGHT')
                pdf.cell(0, 8, str(value), new_x='LMARGIN', new_y='NEXT')
        
        pdf.ln(10)
        pdf.set_font('Helvetica', 'I', 9)
        pdf.cell(0, 8, 'Report generated by FCPMS - Fuel Cell Power Management System', new_x='LMARGIN', new_y='NEXT', align='C')
        
        pdf_bytes = bytes(pdf.output())
        pdf_buffer = io.BytesIO(pdf_bytes)
        
        return send_file(
            pdf_buffer,
            mimetype='application/pdf',
            as_attachment=True,
            download_name='fcpms_sizing_report.pdf'
        )
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/python/generate-diagram', methods=['POST'])
def generate_diagram():
    data = request.json
    diagram_type = data.get('type', 'system')
    
    try:
        if diagram_type == 'system':
            dot = create_system_diagram(data)
        elif diagram_type == 'flow':
            dot = create_flow_diagram(data)
        else:
            dot = create_system_diagram(data)
        
        with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as tmp:
            dot.render(tmp.name.replace('.png', ''), format='png', cleanup=True)
            
            with open(tmp.name, 'rb') as f:
                img_data = f.read()
            
            os.unlink(tmp.name)
            
            return send_file(
                io.BytesIO(img_data),
                mimetype='image/png',
                as_attachment=True,
                download_name='system_diagram.png'
            )
            
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

def create_system_diagram(data):
    dot = graphviz.Digraph(comment='Fuel Cell Power System')
    dot.attr(rankdir='TB', bgcolor='white')
    dot.attr('node', shape='box', style='rounded,filled', fontname='Helvetica')
    
    dot.node('h2', f"H2 Storage\n{data.get('h2Cylinders', 'N')} Cylinders", fillcolor='#e3f2fd')
    dot.node('fc', f"Fuel Cell Stack\n{data.get('fcPower', 'N')} kW", fillcolor='#c8e6c9')
    dot.node('dc', 'DC/DC Converter', fillcolor='#fff3e0')
    dot.node('battery', f"Battery Bank\n{data.get('batteryCapacity', 'N')} Ah", fillcolor='#fce4ec')
    dot.node('load', f"Site Load\n{data.get('load', 'N')} kW", fillcolor='#f3e5f5')
    
    dot.edge('h2', 'fc', label='H2 Feed')
    dot.edge('fc', 'dc', label='DC Power')
    dot.edge('dc', 'battery', label='Charge')
    dot.edge('battery', 'load', label='Supply')
    dot.edge('dc', 'load', label='Direct', style='dashed')
    
    return dot

def create_flow_diagram(data):
    dot = graphviz.Digraph(comment='Decision Flow')
    dot.attr(rankdir='TB', bgcolor='white')
    dot.attr('node', shape='box', style='rounded,filled', fontname='Helvetica')
    
    dot.node('start', 'Start Analysis', shape='ellipse', fillcolor='#c8e6c9')
    dot.node('load_check', 'Load Factor\nAnalysis', shape='diamond', fillcolor='#fff3e0')
    dot.node('age_check', 'Age\nAssessment', shape='diamond', fillcolor='#fff3e0')
    dot.node('keep', 'Keep &\nHybridize', fillcolor='#c8e6c9')
    dot.node('relocate', 'Relocate\nAsset', fillcolor='#e3f2fd')
    dot.node('replace', 'Scrap &\nReplace', fillcolor='#ffcdd2')
    dot.node('support', 'Add Support\nCapacity', fillcolor='#f3e5f5')
    
    dot.edge('start', 'load_check')
    dot.edge('load_check', 'age_check', label='<30%')
    dot.edge('load_check', 'keep', label='30-70%')
    dot.edge('load_check', 'support', label='>70%')
    dot.edge('age_check', 'relocate', label='<10 yrs')
    dot.edge('age_check', 'replace', label='>10 yrs')
    
    return dot

@app.route('/api/python/asset-analysis', methods=['POST'])
def asset_analysis():
    data = request.json
    model = get_gemini_model()
    
    load_factor = data.get('loadFactor', 50)
    age = data.get('age', 5)
    rated_power = data.get('ratedPower', 100)
    running_hours = data.get('runningHours', 500)
    
    if load_factor < 30:
        if age > 10:
            recommendation = 'replace'
            action = 'Scrap & Replace with right-sized fuel cell system'
        else:
            recommendation = 'relocate'
            action = 'Relocate to higher-demand site'
    elif load_factor <= 70:
        recommendation = 'keep'
        action = 'Keep & Hybridize with fuel cell for efficiency'
    else:
        recommendation = 'support'
        action = 'Add support capacity - current asset overloaded'
    
    analysis_text = f"Generator is running at {load_factor}% load factor. {action}"
    
    if model:
        try:
            prompt = f"""Analyze this diesel generator asset for optimization:
- Rated Power: {rated_power} kVA
- Load Factor: {load_factor}%
- Age: {age} years
- Monthly Running Hours: {running_hours}

Current recommendation: {action}

Provide a brief (2-3 sentences) additional insight on:
1. Efficiency implications
2. Cost impact
3. Environmental consideration

CRITICAL INSTRUCTION: Ensure all insights are based on industry standards and engineering best practices. Include specific references to standards (like ISO 8528) where applicable. Do not provide unverified claims."""
            
            response = model.generate_content(prompt)
            analysis_text += "\n\n" + response.text
        except Exception as e:
            pass
    
    return jsonify({
        'success': True,
        'recommendation': recommendation,
        'action': action,
        'analysis': analysis_text,
        'metrics': {
            'efficiency_loss': max(0, (70 - load_factor) * 0.5) if load_factor < 70 else 0,
            'annual_waste_estimate': (rated_power * 0.07 + rated_power * load_factor / 100 * 0.24) * running_hours * 12 * 1.2 * (1 - load_factor / 100) if load_factor < 70 else 0
        }
    })

@app.route('/api/python/generate-csv', methods=['POST'])
def generate_csv():
    data = request.json
    
    try:
        import pandas as pd
        
        rows = []
        
        rows.append({
            'Category': 'Site Parameters',
            'Parameter': 'Project Name',
            'Value': data.get('projectName', 'N/A'),
            'Unit': ''
        })
        rows.append({
            'Category': 'Site Parameters',
            'Parameter': 'Load Requirement',
            'Value': data.get('load', 'N/A'),
            'Unit': 'kW'
        })
        rows.append({
            'Category': 'Site Parameters',
            'Parameter': 'Autonomy',
            'Value': data.get('autonomy', 'N/A'),
            'Unit': 'hours'
        })
        rows.append({
            'Category': 'Site Parameters',
            'Parameter': 'System Voltage',
            'Value': data.get('voltage', 'N/A'),
            'Unit': 'VDC'
        })
        rows.append({
            'Category': 'Site Parameters',
            'Parameter': 'Temperature',
            'Value': data.get('temperature', 'N/A'),
            'Unit': 'C'
        })
        rows.append({
            'Category': 'Site Parameters',
            'Parameter': 'Altitude',
            'Value': data.get('altitude', 'N/A'),
            'Unit': 'm'
        })
        
        if data.get('fuelCell'):
            fc = data.get('fuelCell', {})
            rows.append({
                'Category': 'Fuel Cell',
                'Parameter': 'Manufacturer',
                'Value': fc.get('manufacturer', 'N/A'),
                'Unit': ''
            })
            rows.append({
                'Category': 'Fuel Cell',
                'Parameter': 'Model',
                'Value': fc.get('model', 'N/A'),
                'Unit': ''
            })
            rows.append({
                'Category': 'Fuel Cell',
                'Parameter': 'Rated Power',
                'Value': fc.get('ratedPower', 'N/A'),
                'Unit': 'kW'
            })
            rows.append({
                'Category': 'Fuel Cell',
                'Parameter': 'Efficiency',
                'Value': fc.get('efficiency', 'N/A'),
                'Unit': '%'
            })
        
        if data.get('results'):
            results = data.get('results', {})
            rows.append({
                'Category': 'Results',
                'Parameter': 'Battery Capacity',
                'Value': results.get('batteryCapacity', 'N/A'),
                'Unit': 'Ah'
            })
            rows.append({
                'Category': 'Results',
                'Parameter': 'Battery Strings',
                'Value': results.get('batteryStrings', 'N/A'),
                'Unit': ''
            })
            rows.append({
                'Category': 'Results',
                'Parameter': 'H2 Cylinders Required',
                'Value': results.get('h2Cylinders', 'N/A'),
                'Unit': ''
            })
            rows.append({
                'Category': 'Results',
                'Parameter': 'Cable Size',
                'Value': results.get('cableSize', 'N/A'),
                'Unit': 'mm2'
            })
        
        if data.get('financial'):
            fin = data.get('financial', {})
            rows.append({
                'Category': 'Financial',
                'Parameter': 'Diesel Generator Daily Cost',
                'Value': fin.get('dgDailyCost', 'N/A'),
                'Unit': 'USD'
            })
            rows.append({
                'Category': 'Financial',
                'Parameter': 'Fuel Cell Daily Cost',
                'Value': fin.get('fcDailyCost', 'N/A'),
                'Unit': 'USD'
            })
            rows.append({
                'Category': 'Financial',
                'Parameter': 'Daily Savings',
                'Value': fin.get('dailySavings', 'N/A'),
                'Unit': 'USD'
            })
            rows.append({
                'Category': 'Financial',
                'Parameter': 'Annual Savings',
                'Value': fin.get('annualSavings', 'N/A'),
                'Unit': 'USD'
            })
            rows.append({
                'Category': 'Financial',
                'Parameter': 'Payback Period',
                'Value': fin.get('paybackYears', 'N/A'),
                'Unit': 'years'
            })
            rows.append({
                'Category': 'Financial',
                'Parameter': 'CO2 Savings',
                'Value': fin.get('co2Savings', 'N/A'),
                'Unit': 'kg/year'
            })
        
        df = pd.DataFrame(rows)
        csv_buffer = io.StringIO()
        df.to_csv(csv_buffer, index=False)
        
        csv_bytes = csv_buffer.getvalue().encode('utf-8')
        
        return send_file(
            io.BytesIO(csv_bytes),
            mimetype='text/csv',
            as_attachment=True,
            download_name='fcpms_data_export.csv'
        )
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PYTHON_SERVICE_PORT', 5001))
    app.run(host='0.0.0.0', port=port)
